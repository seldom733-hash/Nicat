import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheService } from './cache.service';
import { CACHE_KEY, CacheConfig } from './cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheConfig = this.reflector.get<CacheConfig>(
      CACHE_KEY,
      context.getHandler(),
    );

    if (!cacheConfig) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateKey(cacheConfig.key, request);

    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheService.set(cacheKey, data, cacheConfig.ttl);
      }),
    );
  }

  private generateKey(baseKey: string, request: any): string {
    const params = JSON.stringify(request.params || {});
    const query = JSON.stringify(request.query || {});
    const user = request.user?.id || 'anonymous';
    return `${baseKey}:${user}:${params}:${query}`;
  }
}
