"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const redis_config_1 = require("../config/redis.config");
let CacheService = CacheService_1 = class CacheService {
    configService;
    logger = new common_1.Logger(CacheService_1.name);
    redis;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            const config = (0, redis_config_1.getRedisConfig)(this.configService);
            this.redis = new ioredis_1.default(config);
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
            await this.redis.connect();
        }
        catch {
            this.logger.warn('Redis недоступен, кэширование отключено');
        }
    }
    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
    isAvailable() {
        try {
            return !!this.redis && this.redis.status === 'ready';
        }
        catch {
            return false;
        }
    }
    async get(key) {
        if (!this.isAvailable())
            return null;
        try {
            const value = await this.redis.get(key);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error(`Cache get error для ${key}:`, error.message);
            return null;
        }
    }
    async set(key, value, ttl = redis_config_1.REDIS_CACHE_TTL.MEDIUM) {
        if (!this.isAvailable())
            return;
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
        }
        catch (error) {
            this.logger.error(`Cache set error для ${key}:`, error.message);
        }
    }
    async del(key) {
        if (!this.isAvailable())
            return;
        try {
            await this.redis.del(key);
        }
        catch (error) {
            this.logger.error(`Cache del error для ${key}:`, error.message);
        }
    }
    async delPattern(pattern) {
        if (!this.isAvailable())
            return;
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (error) {
            this.logger.error(`Cache delPattern error для ${pattern}:`, error.message);
        }
    }
    async getOrSet(key, fetchFn, ttl = redis_config_1.REDIS_CACHE_TTL.MEDIUM) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const value = await fetchFn();
        await this.set(key, value, ttl);
        return value;
    }
    async increment(key) {
        if (!this.isAvailable())
            return 0;
        try {
            return await this.redis.incr(key);
        }
        catch (error) {
            this.logger.error(`Cache increment error для ${key}:`, error.message);
            return 0;
        }
    }
    async decrement(key) {
        if (!this.isAvailable())
            return 0;
        try {
            return await this.redis.decr(key);
        }
        catch (error) {
            this.logger.error(`Cache decrement error для ${key}:`, error.message);
            return 0;
        }
    }
    async setHash(key, field, value) {
        if (!this.isAvailable())
            return;
        try {
            await this.redis.hset(key, field, JSON.stringify(value));
        }
        catch (error) {
            this.logger.error(`Cache setHash error для ${key}:`, error.message);
        }
    }
    async getHash(key, field) {
        if (!this.isAvailable())
            return null;
        try {
            const value = await this.redis.hget(key, field);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error(`Cache getHash error для ${key}:`, error.message);
            return null;
        }
    }
    async ttl(key) {
        if (!this.isAvailable())
            return -1;
        try {
            return await this.redis.ttl(key);
        }
        catch (error) {
            return -1;
        }
    }
    async exists(key) {
        if (!this.isAvailable())
            return false;
        try {
            return (await this.redis.exists(key)) === 1;
        }
        catch (error) {
            return false;
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map