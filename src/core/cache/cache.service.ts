import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig, REDIS_CACHE_TTL } from '../config/redis.config';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const config = getRedisConfig(this.configService);
      this.redis = new Redis(config);

      this.redis.on('connect', () => {
        this.logger.log('Redis подключен');
      });

      let errorLogged = false;
      this.redis.on('error', (error) => {
        if (!errorLogged) {
          this.logger.warn(`Redis недоступен (${error.message}), кэширование отключено`);
          errorLogged = true;
        }
      });

      // connect() respects connectTimeout from config (3000ms default)
      // and won't hang if Redis is unreachable
      await Promise.race([
        this.redis.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Redis connect timeout')), 5000),
        ),
      ]);
    } catch (error) {
      this.logger.warn(`Redis недоступен (${error?.message || error}), кэширование отключено`);
      // Nullify redis so isAvailable() returns false safely
      this.redis = null as any;
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  private isAvailable(): boolean {
    try {
      return !!this.redis && this.redis.status === 'ready';
    } catch {
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Cache get error для ${key}:`, error.message);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = REDIS_CACHE_TTL.MEDIUM): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Cache set error для ${key}:`, error.message);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Cache del error для ${key}:`, error.message);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Cache delPattern error для ${pattern}:`, error.message);
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = REDIS_CACHE_TTL.MEDIUM,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    await this.set(key, value, ttl);
    return value;
  }

  async increment(key: string): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.redis.incr(key);
    } catch (error) {
      this.logger.error(`Cache increment error для ${key}:`, error.message);
      return 0;
    }
  }

  async decrement(key: string): Promise<number> {
    if (!this.isAvailable()) return 0;

    try {
      return await this.redis.decr(key);
    } catch (error) {
      this.logger.error(`Cache decrement error для ${key}:`, error.message);
      return 0;
    }
  }

  async setHash(key: string, field: string, value: any): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.redis.hset(key, field, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Cache setHash error для ${key}:`, error.message);
    }
  }

  async getHash<T>(key: string, field: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const value = await this.redis.hget(key, field);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Cache getHash error для ${key}:`, error.message);
      return null;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isAvailable()) return -1;

    try {
      return await this.redis.ttl(key);
    } catch (error) {
      return -1;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      return (await this.redis.exists(key)) === 1;
    } catch (error) {
      return false;
    }
  }
}
