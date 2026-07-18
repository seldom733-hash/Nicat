import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CacheService } from './cache.service';
export declare class CacheInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly cacheService;
    constructor(reflector: Reflector, cacheService: CacheService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private generateKey;
}
