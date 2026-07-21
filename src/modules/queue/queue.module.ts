import { Module, Global, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { EmailProcessor } from './processors/email.processor';
import { PaymentProcessor } from './processors/payment.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { getQueueConfig, QueueNames } from '../../core/config/queue.config';

const logger = new Logger('QueueModule');

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        logger.log(`Queue Redis config: ${redisHost}:${redisPort} (lazy connect)`);
        return getQueueConfig(redisHost, redisPort, redisPassword);
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QueueNames.EMAIL },
      { name: QueueNames.PAYMENT },
      { name: QueueNames.NOTIFICATION },
      { name: QueueNames.SEARCH_INDEX },
      { name: QueueNames.ANALYTICS },
      { name: QueueNames.FILE_UPLOAD },
    ),
  ],
  providers: [QueueService, EmailProcessor, PaymentProcessor, NotificationProcessor],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
