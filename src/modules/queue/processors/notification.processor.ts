import { Process, Processor, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { QueueNames, JobNames } from '../../../core/config/queue.config';

@Processor(QueueNames.NOTIFICATION)
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process(JobNames.SEND_PUSH_NOTIFICATION)
  async handlePushNotification(job: Job<{
    userId: string;
    title: string;
    body: string;
    data?: any;
  }>) {
    this.logger.log(`Отправка push уведомления пользователю ${job.data.userId}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true };
  }

  @Process(JobNames.SEND_IN_APP_NOTIFICATION)
  async handleInAppNotification(job: Job<{
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }>) {
    this.logger.log(`Создание in-app уведомления для ${job.data.userId}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true };
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Задача ${job.id} завершена: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Задача ${job.id} провалилась: ${error.message}`);
  }
}
