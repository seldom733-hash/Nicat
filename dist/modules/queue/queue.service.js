"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const queue_config_1 = require("../../core/config/queue.config");
let QueueService = QueueService_1 = class QueueService {
    emailQueue;
    paymentQueue;
    notificationQueue;
    searchIndexQueue;
    analyticsQueue;
    fileUploadQueue;
    logger = new common_1.Logger(QueueService_1.name);
    constructor(emailQueue, paymentQueue, notificationQueue, searchIndexQueue, analyticsQueue, fileUploadQueue) {
        this.emailQueue = emailQueue;
        this.paymentQueue = paymentQueue;
        this.notificationQueue = notificationQueue;
        this.searchIndexQueue = searchIndexQueue;
        this.analyticsQueue = analyticsQueue;
        this.fileUploadQueue = fileUploadQueue;
    }
    async onModuleInit() {
        this.logger.log('Queue Service инициализирован');
        await this.logQueueStats();
    }
    async sendWelcomeEmail(data) {
        return this.emailQueue.add(queue_config_1.JobNames.SEND_WELCOME_EMAIL, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
        });
    }
    async sendBookingConfirmation(data) {
        return this.emailQueue.add(queue_config_1.JobNames.SEND_BOOKING_CONFIRMATION, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
        });
    }
    async sendPaymentReceipt(data) {
        return this.emailQueue.add(queue_config_1.JobNames.SEND_PAYMENT_RECEIPT, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
        });
    }
    async processPayment(data) {
        return this.paymentQueue.add(queue_config_1.JobNames.PROCESS_PAYMENT, data, {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: false,
            removeOnFail: false,
        });
    }
    async handleWebhook(data) {
        return this.paymentQueue.add(queue_config_1.JobNames.HANDLE_WEBHOOK, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
        });
    }
    async sendPushNotification(data) {
        return this.notificationQueue.add(queue_config_1.JobNames.SEND_PUSH_NOTIFICATION, data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    async sendInAppNotification(data) {
        return this.notificationQueue.add(queue_config_1.JobNames.SEND_IN_APP_NOTIFICATION, data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    async indexTour(data) {
        return this.searchIndexQueue.add(queue_config_1.JobNames.INDEX_TOUR, data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    async reindexAll() {
        return this.searchIndexQueue.add(queue_config_1.JobNames.REINDEX_ALL, {}, {
            attempts: 1,
            removeOnComplete: true,
        });
    }
    async generateReport(data) {
        return this.analyticsQueue.add(queue_config_1.JobNames.GENERATE_REPORT, data, {
            attempts: 3,
            removeOnComplete: false,
            timeout: 60000,
        });
    }
    async aggregateStats() {
        return this.analyticsQueue.add(queue_config_1.JobNames.AGGREGATE_STATS, {}, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    async processImage(data) {
        return this.fileUploadQueue.add(queue_config_1.JobNames.PROCESS_IMAGE, data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    async resizeImage(data) {
        return this.fileUploadQueue.add(queue_config_1.JobNames.RESIZE_IMAGE, data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    async getQueueStats() {
        const queues = [
            this.emailQueue,
            this.paymentQueue,
            this.notificationQueue,
            this.searchIndexQueue,
            this.analyticsQueue,
            this.fileUploadQueue,
        ];
        const stats = await Promise.all(queues.map(async (queue) => ({
            name: queue.name,
            waiting: await queue.getWaitingCount(),
            active: await queue.getActiveCount(),
            completed: await queue.getCompletedCount(),
            failed: await queue.getFailedCount(),
            delayed: await queue.getDelayedCount(),
        })));
        return stats;
    }
    async logQueueStats() {
        const stats = await this.getQueueStats();
        stats.forEach((stat) => {
            this.logger.log(`Queue ${stat.name}: waiting=${stat.waiting}, active=${stat.active}, completed=${stat.completed}, failed=${stat.failed}`);
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
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)(queue_config_1.QueueNames.EMAIL)),
    __param(1, (0, bull_1.InjectQueue)(queue_config_1.QueueNames.PAYMENT)),
    __param(2, (0, bull_1.InjectQueue)(queue_config_1.QueueNames.NOTIFICATION)),
    __param(3, (0, bull_1.InjectQueue)(queue_config_1.QueueNames.SEARCH_INDEX)),
    __param(4, (0, bull_1.InjectQueue)(queue_config_1.QueueNames.ANALYTICS)),
    __param(5, (0, bull_1.InjectQueue)(queue_config_1.QueueNames.FILE_UPLOAD)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], QueueService);
//# sourceMappingURL=queue.service.js.map