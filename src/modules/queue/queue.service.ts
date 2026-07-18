import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { QueueNames, JobNames } from '../../core/config/queue.config';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QueueNames.EMAIL) private emailQueue: Queue,
    @InjectQueue(QueueNames.PAYMENT) private paymentQueue: Queue,
    @InjectQueue(QueueNames.NOTIFICATION) private notificationQueue: Queue,
    @InjectQueue(QueueNames.SEARCH_INDEX) private searchIndexQueue: Queue,
    @InjectQueue(QueueNames.ANALYTICS) private analyticsQueue: Queue,
    @InjectQueue(QueueNames.FILE_UPLOAD) private fileUploadQueue: Queue,
  ) {}

  async onModuleInit() {
    this.logger.log('Queue Service инициализирован');
    await this.logQueueStats();
  }

  // ==================== Email ====================

  async sendWelcomeEmail(data: { email: string; firstName: string }) {
    return this.emailQueue.add(JobNames.SEND_WELCOME_EMAIL, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }

  async sendBookingConfirmation(data: {
    email: string;
    bookingReference: string;
    tourTitle: string;
    tourDate: string;
    totalPrice: number;
  }) {
    return this.emailQueue.add(JobNames.SEND_BOOKING_CONFIRMATION, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }

  async sendPaymentReceipt(data: {
    email: string;
    paymentId: string;
    amount: number;
    currency: string;
  }) {
    return this.emailQueue.add(JobNames.SEND_PAYMENT_RECEIPT, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }

  // ==================== Payment ====================

  async processPayment(data: {
    bookingId: string;
    userId: string;
    amount: number;
    currency: string;
  }) {
    return this.paymentQueue.add(JobNames.PROCESS_PAYMENT, data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: false,
      removeOnFail: false,
    });
  }

  async handleWebhook(data: { eventType: string; payload: any }) {
    return this.paymentQueue.add(JobNames.HANDLE_WEBHOOK, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }

  // ==================== Notification ====================

  async sendPushNotification(data: {
    userId: string;
    title: string;
    body: string;
    data?: any;
  }) {
    return this.notificationQueue.add(JobNames.SEND_PUSH_NOTIFICATION, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  async sendInAppNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }) {
    return this.notificationQueue.add(JobNames.SEND_IN_APP_NOTIFICATION, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  // ==================== Search ====================

  async indexTour(data: { tourId: string; action: 'create' | 'update' | 'delete' }) {
    return this.searchIndexQueue.add(JobNames.INDEX_TOUR, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  async reindexAll() {
    return this.searchIndexQueue.add(JobNames.REINDEX_ALL, {}, {
      attempts: 1,
      removeOnComplete: true,
    });
  }

  // ==================== Analytics ====================

  async generateReport(data: {
    type: string;
    startDate: string;
    endDate: string;
    userId?: string;
  }) {
    return this.analyticsQueue.add(JobNames.GENERATE_REPORT, data, {
      attempts: 3,
      removeOnComplete: false,
      timeout: 60000, // 1 минута
    });
  }

  async aggregateStats() {
    return this.analyticsQueue.add(JobNames.AGGREGATE_STATS, {}, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  // ==================== File Upload ====================

  async processImage(data: { fileId: string; operations: string[] }) {
    return this.fileUploadQueue.add(JobNames.PROCESS_IMAGE, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  async resizeImage(data: {
    fileId: string;
    widths: number[];
    format: 'jpeg' | 'png' | 'webp';
  }) {
    return this.fileUploadQueue.add(JobNames.RESIZE_IMAGE, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  // ==================== Stats ====================

  async getQueueStats() {
    const queues = [
      this.emailQueue,
      this.paymentQueue,
      this.notificationQueue,
      this.searchIndexQueue,
      this.analyticsQueue,
      this.fileUploadQueue,
    ];

    const stats = await Promise.all(
      queues.map(async (queue) => ({
        name: queue.name,
        waiting: await queue.getWaitingCount(),
        active: await queue.getActiveCount(),
        completed: await queue.getCompletedCount(),
        failed: await queue.getFailedCount(),
        delayed: await queue.getDelayedCount(),
      }))
    );

    return stats;
  }

  private async logQueueStats() {
    const stats = await this.getQueueStats();
    stats.forEach((stat) => {
      this.logger.log(
        `Queue ${stat.name}: waiting=${stat.waiting}, active=${stat.active}, completed=${stat.completed}, failed=${stat.failed}`
      );
    });
  }

  async cleanQueues() {
    const queues = [
      this.emailQueue,
      this.paymentQueue,
      this.notificationQueue,
      this.searchIndexQueue,
      this.analyticsQueue,
      this.fileUploadQueue,
    ];

    for (const queue of queues) {
      await queue.clean(0, 'completed');
      await queue.clean(0, 'failed');
    }
  }
}
