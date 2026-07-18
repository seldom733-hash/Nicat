import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'nicat'),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],

  // Connection pooling для масштабирования
  poolSize: configService.get<number>('DB_POOL_SIZE', 20),
  extra: {
    max: configService.get<number>('DB_MAX_CONNECTIONS', 20),
    min: configService.get<number>('DB_MIN_CONNECTIONS', 5),
    acquireTimeoutMillis: configService.get<number>('DB_ACQUIRE_TIMEOUT', 30000),
    idleTimeoutMillis: configService.get<number>('DB_IDLE_TIMEOUT', 30000),
  },

  // Schema management
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('DB_LOGGING', 'false') === 'true',

  // SSL для production
  ssl: configService.get<string>('DB_SSL') === 'true'
    ? { rejectUnauthorized: false }
    : false,


});
