import { Process, Processor, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { QueueNames, JobNames } from '../../../core/config/queue.config';

@Processor(QueueNames.PAYMENT)
export class PaymentProcessor {
  private readonly logger = new Logger(PaymentProcessor.name);

  @Process(JobNames.PROCESS_PAYMENT)
  async handleProcessPayment(job: Job<{
    bookingId: string;
    userId: string;
    amount: number;
    currency: string;
  }>) {
    this.logger.log(`Обработка платежа для бронирования ${job.data.bookingId}`);
    // Здесь будет логика обработки платежа
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true };
  }

  @Process(JobNames.HANDLE_WEBHOOK)
  async handleWebhook(job: Job<{ eventType: string; payload: any }>) {
    this.logger.log(`Обработка webhook: ${job.data.eventType}`);
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
