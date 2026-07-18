export declare const CACHE_KEY = "cache_config";
export interface CacheConfig {
    key: string;
    ttl: number;
}
export declare const Cacheable: (key: string, ttl?: number) => import("@nestjs/common").CustomDecorator<string>;
export declare const InvalidateCache: (pattern: string) => import("@nestjs/common").CustomDecorator<string>;
