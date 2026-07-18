"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const express = __importStar(require("express"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    const isDev = configService.get('NODE_ENV') !== 'production';
    const corsOrigin = isDev ? undefined : configService.get('CORS_ORIGIN');
    logger.log(`[CORS] Mode=${isDev ? 'dev (allow all)' : 'prod'}, CORS_ORIGIN=${corsOrigin || '(not set)'}`);
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (req.method === 'OPTIONS') {
            if (corsOrigin && origin && origin !== corsOrigin) {
                res.status(204).end();
                return;
            }
            res.setHeader('Access-Control-Allow-Origin', corsOrigin || origin || '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Max-Age', '86400');
            res.setHeader('Vary', 'Origin');
            res.status(204).end();
            return;
        }
        if (corsOrigin) {
            if (origin === corsOrigin) {
                res.setHeader('Access-Control-Allow-Origin', corsOrigin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }
        }
        else {
            if (origin) {
                res.setHeader('Access-Control-Allow-Origin', origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }
        }
        res.setHeader('Vary', 'Origin');
        next();
    });
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        contentSecurityPolicy: false,
    }));
    app.use('/api/v1/payments/stripe/webhook', express.raw({
        type: 'application/json',
        verify: (req, _res, buf) => { req.rawBody = buf; },
    }));
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nicat - Social Travel Marketplace')
        .setDescription('API for the global social travel marketplace platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('tours', 'Tour management')
        .addTag('bookings', 'Booking management')
        .addTag('payments', 'Payment processing')
        .addTag('chat', 'Real-time chat')
        .addTag('reviews', 'Tour reviews')
        .addTag('dashboard', 'Host dashboard')
        .addTag('admin', 'Admin management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.enableShutdownHooks();
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Nicat API running on: http://0.0.0.0:${port}`);
    logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map