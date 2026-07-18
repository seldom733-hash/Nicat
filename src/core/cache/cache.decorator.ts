import { SetMetadata } from '@nestjs/common';
import { REDIS_CACHE_TTL } from '../config/redis.config';

export const CACHE_KEY = 'cache_config';

export interface CacheConfig {
  key: string;
  ttl: number;
}

export const Cacheable = (key: string, ttl: number = REDIS_CACHE_TTL.MEDIUM) =>
  SetMetadata(CACHE_KEY, { key, ttl } as CacheConfig);

export const InvalidateCache = (pattern: string) =>
  SetMetadata('invalidate_cache', pattern);
