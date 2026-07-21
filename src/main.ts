import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);

  // CORS FIRST - manual middleware to guarantee Access-Control-Allow-Origin is set
  // In development: always allow all origins (ignore system env CORS_ORIGIN)
  // In production: only allow CORS_ORIGIN env var
  const isDev = configService.get<string>('NODE_ENV') !== 'production';
  const corsOrigin = isDev ? undefined : configService.get<string>('CORS_ORIGIN');
  logger.log(`[CORS] Mode=${isDev ? 'dev (allow all)' : 'prod'}, CORS_ORIGIN=${corsOrigin || '(not set)'}`);

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const origin = req.headers.origin;

    if (req.method === 'OPTIONS') {
      // Preflight: set all CORS headers and respond 204
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

    // Non-preflight: set CORS headers then continue
    if (corsOrigin) {
      if (origin === corsOrigin) {
        res.setHeader('Access-Control-Allow-Origin', corsOrigin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
    } else {
      // Development: reflect any origin
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
    }

    res.setHeader('Vary', 'Origin');
    next();
  });

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false,
  }));

  // Raw body parsing for Stripe webhooks
  app.use('/api/v1/payments/stripe/webhook', express.raw({
    type: 'application/json',
    verify: (req: any, _res: any, buf: Buffer) => { req.rawBody = buf; },
  }));

  // Static file serving for uploaded media
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Nicat API running on: http://0.0.0.0:${port}`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
