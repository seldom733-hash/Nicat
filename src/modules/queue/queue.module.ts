import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { EmailProcessor } from './processors/email.processor';
import { PaymentProcessor } from './processors/payment.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { getQueueConfig, QueueNames } from '../../core/config/queue.config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return getQueueConfig(
          configService.get<string>('REDIS_HOST', 'localhost'),
          configService.get<number>('REDIS_PORT', 6379),
          configService.get<string>('REDIS_PASSWORD'),
        );
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
