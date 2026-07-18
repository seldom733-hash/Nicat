"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_KEYS = exports.REDIS_CACHE_TTL = exports.getRedisConfig = void 0;
const getRedisConfig = (configService) => ({
    host: configService.get('REDIS_HOST', 'localhost'),
    port: configService.get('REDIS_PORT', 6379),
    password: configService.get('REDIS_PASSWORD') || undefined,
    db: configService.get('REDIS_DB', 0),
    maxRetriesPerRequest: 0,
    enableReadyCheck: false,
    lazyConnect: true,
    connectTimeout: 3000,
    retryStrategy: () => null,
});
exports.getRedisConfig = getRedisConfig;
exports.REDIS_CACHE_TTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    VERY_LONG: 86400,
};
exports.REDIS_KEYS = {
    TOUR_SEARCH: 'nicat:tours:search:',
    TOUR_DETAIL: 'nicat:tours:detail:',
    USER_SESSION: 'nicat:sessions:',
    RATE_LIMIT: 'nicat:ratelimit:',
    STATS: 'nicat:stats:',
};
//# sourceMappingURL=redis.config.js.map