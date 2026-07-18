"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidateCache = exports.Cacheable = exports.CACHE_KEY = void 0;
const common_1 = require("@nestjs/common");
const redis_config_1 = require("../config/redis.config");
exports.CACHE_KEY = 'cache_config';
const Cacheable = (key, ttl = redis_config_1.REDIS_CACHE_TTL.MEDIUM) => (0, common_1.SetMetadata)(exports.CACHE_KEY, { key, ttl });
exports.Cacheable = Cacheable;
const InvalidateCache = (pattern) => (0, common_1.SetMetadata)('invalidate_cache', pattern);
exports.InvalidateCache = InvalidateCache;
//# sourceMappingURL=cache.decorator.js.map