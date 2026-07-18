import { ConfigService } from '@nestjs/config';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  maxRetriesPerRequest: number;
  enableReadyCheck: boolean;
  lazyConnect: boolean;
  connectTimeout: number;
  retryStrategy: (times: number) => null | number;
}

export const getRedisConfig = (configService: ConfigService): RedisConfig => ({
  host: configService.get<string>('REDIS_HOST', 'localhost'),
  port: configService.get<number>('REDIS_PORT', 6379),
  password: configService.get<string>('REDIS_PASSWORD') || undefined,
  db: configService.get<number>('REDIS_DB', 0),
  maxRetriesPerRequest: 0,
  enableReadyCheck: false,
  lazyConnect: true,
  connectTimeout: 3000,
  retryStrategy: () => null,
});

export const REDIS_CACHE_TTL = {
  SHORT: 60, // 1 минута
  MEDIUM: 300, // 5 минут
  LONG: 3600, // 1 час
  VERY_LONG: 86400, // 24 часа
};

export const REDIS_KEYS = {
  TOUR_SEARCH: 'nicat:tours:search:',
  TOUR_DETAIL: 'nicat:tours:detail:',
  USER_SESSION: 'nicat:sessions:',
  RATE_LIMIT: 'nicat:ratelimit:',
  STATS: 'nicat:stats:',
};
