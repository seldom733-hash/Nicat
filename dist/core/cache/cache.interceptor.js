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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const cache_service_1 = require("./cache.service");
const cache_decorator_1 = require("./cache.decorator");
let CacheInterceptor = class CacheInterceptor {
    reflector;
    cacheService;
    constructor(reflector, cacheService) {
        this.reflector = reflector;
        this.cacheService = cacheService;
    }
    async intercept(context, next) {
        const cacheConfig = this.reflector.get(cache_decorator_1.CACHE_KEY, context.getHandler());
        if (!cacheConfig) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const cacheKey = this.generateKey(cacheConfig.key, request);
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            return (0, rxjs_1.of)(cached);
        }
        return next.handle().pipe((0, operators_1.tap)(async (data) => {
            await this.cacheService.set(cacheKey, data, cacheConfig.ttl);
        }));
    }
    generateKey(baseKey, request) {
        const params = JSON.stringify(request.params || {});
        const query = JSON.stringify(request.query || {});
        const user = request.user?.id || 'anonymous';
        return `${baseKey}:${user}:${params}:${query}`;
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        cache_service_1.CacheService])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map