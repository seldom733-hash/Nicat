"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const throttler_guard_1 = require("./core/guards/throttler.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const tours_module_1 = require("./modules/tours/tours.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const payments_module_1 = require("./modules/payments/payments.module");
const chat_module_1 = require("./modules/chat/chat.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const admin_module_1 = require("./modules/admin/admin.module");
const search_module_1 = require("./modules/search/search.module");
const health_module_1 = require("./modules/health/health.module");
const common_module_1 = require("./common/common.module");
const cache_module_1 = require("./core/cache/cache.module");
const cache_interceptor_1 = require("./core/cache/cache.interceptor");
const queue_module_1 = require("./modules/queue/queue.module");
const database_config_1 = require("./core/config/database.config");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => (0, database_config_1.getDatabaseConfig)(configService),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tours_module_1.ToursModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            chat_module_1.ChatModule,
            reviews_module_1.ReviewsModule,
            dashboard_module_1.DashboardModule,
            admin_module_1.AdminModule,
            search_module_1.SearchModule,
            health_module_1.HealthModule,
            common_module_1.CommonModule,
            cache_module_1.CacheModule,
            queue_module_1.QueueModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_guard_1.CustomThrottlerGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.ClassSerializerInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_interceptor_1.CacheInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map