import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class CacheService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private redis;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private isAvailable;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T>;
    increment(key: string): Promise<number>;
    decrement(key: string): Promise<number>;
    setHash(key: string, field: string, value: any): Promise<void>;
    getHash<T>(key: string, field: string): Promise<T | null>;
    ttl(key: string): Promise<number>;
    exists(key: string): Promise<boolean>;
}
