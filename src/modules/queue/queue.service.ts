import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { QueueNames, JobNames } from '../../core/config/queue.config';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private isRedisAvailable = false;

  constructor(
    @InjectQueue(QueueNames.EMAIL) private emailQueue: Queue,
    @InjectQueue(QueueNames.PAYMENT) private paymentQueue: Queue,
    @InjectQueue(QueueNames.NOTIFICATION) private notificationQueue: Queue,
    @InjectQueue(QueueNames.SEARCH_INDEX) private searchIndexQueue: Queue,
    @InjectQueue(QueueNames.ANALYTICS) private analyticsQueue: Queue,
    @InjectQueue(QueueNames.FILE_UPLOAD) private fileUploadQueue: Queue,
  ) {}

  async onModuleInit() {
    try {
      // Test if Redis is reachable by getting the client
      const client = this.emailQueue.client;
      if (client && typeof client.connect === 'function') {
        await client.connect();
      }
      this.isRedisAvailable = true;
      this.logger.log('Queue Service инициализирован (Redis доступен)');
      await this.logQueueStats();
    } catch (error) {
      this.isRedisAvailable = false;
      this.logger.warn(`Redis недоступен для очередей (${error.message}), фоновые задачи отключены`);
    }
  }

  private checkRedis(): boolean {
    if (!this.isRedisAvailable) {
      this.logger.debug('Redis недоступен, операция очереди пропущена');
      return false;
    }
    return true;
  }

  // ==================== Email ====================

  async sendWelcomeEmail(data: { email: string; firstName: string }) {
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
    return this.paymentQueue.add(JobNames.PROCESS_PAYMENT, data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: false,
      removeOnFail: false,
    });
  }

  async handleWebhook(data: { eventType: string; payload: any }) {
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
    return this.notificationQueue.add(JobNames.SEND_IN_APP_NOTIFICATION, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  // ==================== Search ====================

  async indexTour(data: { tourId: string; action: 'create' | 'update' | 'delete' }) {
    if (!this.checkRedis()) return;
    return this.searchIndexQueue.add(JobNames.INDEX_TOUR, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  async reindexAll() {
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
    return this.analyticsQueue.add(JobNames.GENERATE_REPORT, data, {
      attempts: 3,
      removeOnComplete: false,
      timeout: 60000,
    });
  }

  async aggregateStats() {
    if (!this.checkRedis()) return;
    return this.analyticsQueue.add(JobNames.AGGREGATE_STATS, {}, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  // ==================== File Upload ====================

  async processImage(data: { fileId: string; operations: string[] }) {
    if (!this.checkRedis()) return;
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
    if (!this.checkRedis()) return;
    return this.fileUploadQueue.add(JobNames.RESIZE_IMAGE, data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }

  // ==================== Stats ====================

  async getQueueStats() {
    if (!this.checkRedis()) return [];

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
    if (!this.checkRedis()) return;
    const stats = await this.getQueueStats();
    if (!stats || stats.length === 0) return;
    stats.forEach((stat) => {
      this.logger.log(
        `Queue ${stat.name}: waiting=${stat.waiting}, active=${stat.active}, completed=${stat.completed}, failed=${stat.failed}`
      );
    });
  }

  async cleanQueues() {
    if (!this.checkRedis()) return;

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
