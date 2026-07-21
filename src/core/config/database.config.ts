import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  // Default port 5433 = local PostgreSQL stored in pgdata/ (inside the project)
  // Override via DB_PORT env var to use system PostgreSQL (5432) or Docker
  port: configService.get<number>('DB_PORT', 5433),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'nicat'),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],

  // Connection timeout — prevents app from hanging when DB is unavailable
  connectTimeoutMS: configService.get<number>('DB_CONNECT_TIMEOUT', 10000),
  // Connection pooling для масштабирования
  poolSize: configService.get<number>('DB_POOL_SIZE', 20),
  extra: {
    max: configService.get<number>('DB_MAX_CONNECTIONS', 20),
    min: configService.get<number>('DB_MIN_CONNECTIONS', 5),
    acquireTimeoutMillis: configService.get<number>('DB_ACQUIRE_TIMEOUT', 10000),
    idleTimeoutMillis: configService.get<number>('DB_IDLE_TIMEOUT', 30000),
    connectionTimeoutMillis: configService.get<number>('DB_CONNECT_TIMEOUT', 10000),
  },

  // Schema management
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('DB_LOGGING', 'false') === 'true',

  // SSL для production
  ssl: configService.get<string>('DB_SSL') === 'true'
    ? { rejectUnauthorized: false }
    : false,


});
