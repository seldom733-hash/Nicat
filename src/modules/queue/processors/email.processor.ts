import { Process, Processor, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { QueueNames, JobNames } from '../../../core/config/queue.config';

@Processor(QueueNames.EMAIL)
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process(JobNames.SEND_WELCOME_EMAIL)
  async handleWelcomeEmail(job: Job<{ email: string; firstName: string }>) {
    this.logger.log(`Обработка welcome email для ${job.data.email}`);
    // Здесь будет логика отправки email через SendGrid/SES
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true };
  }

  @Process(JobNames.SEND_BOOKING_CONFIRMATION)
  async handleBookingConfirmation(job: Job<{
    email: string;
    bookingReference: string;
    tourTitle: string;
    tourDate: string;
    totalPrice: number;
  }>) {
    this.logger.log(`Обработка booking confirmation для ${job.data.email}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true };
  }

  @Process(JobNames.SEND_PAYMENT_RECEIPT)
  async handlePaymentReceipt(job: Job<{
    email: string;
    paymentId: string;
    amount: number;
    currency: string;
  }>) {
    this.logger.log(`Обработка payment receipt для ${job.data.email}`);
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
