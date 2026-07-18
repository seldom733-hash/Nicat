"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'nicat'),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    poolSize: configService.get('DB_POOL_SIZE', 20),
    extra: {
        max: configService.get('DB_MAX_CONNECTIONS', 20),
        min: configService.get('DB_MIN_CONNECTIONS', 5),
        acquireTimeoutMillis: configService.get('DB_ACQUIRE_TIMEOUT', 30000),
        idleTimeoutMillis: configService.get('DB_IDLE_TIMEOUT', 30000),
    },
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('DB_LOGGING', 'false') === 'true',
    ssl: configService.get('DB_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : false,
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map