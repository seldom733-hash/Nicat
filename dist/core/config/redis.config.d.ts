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
export declare const getRedisConfig: (configService: ConfigService) => RedisConfig;
export declare const REDIS_CACHE_TTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    VERY_LONG: number;
};
export declare const REDIS_KEYS: {
    TOUR_SEARCH: string;
    TOUR_DETAIL: string;
    USER_SESSION: string;
    RATE_LIMIT: string;
    STATS: string;
};
