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
var NotificationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const queue_config_1 = require("../../../core/config/queue.config");
let NotificationProcessor = NotificationProcessor_1 = class NotificationProcessor {
    logger = new common_1.Logger(NotificationProcessor_1.name);
    async handlePushNotification(job) {
        this.logger.log(`Отправка push уведомления пользователю ${job.data.userId}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { success: true };
    }
    async handleInAppNotification(job) {
        this.logger.log(`Создание in-app уведомления для ${job.data.userId}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { success: true };
    }
    onCompleted(job, result) {
        this.logger.log(`Задача ${job.id} завершена: ${JSON.stringify(result)}`);
    }
    onFailed(job, error) {
        this.logger.error(`Задача ${job.id} провалилась: ${error.message}`);
    }
};
exports.NotificationProcessor = NotificationProcessor;
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.SEND_PUSH_NOTIFICATION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "handlePushNotification", null);
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.SEND_IN_APP_NOTIFICATION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "handleInAppNotification", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], NotificationProcessor.prototype, "onFailed", null);
exports.NotificationProcessor = NotificationProcessor = NotificationProcessor_1 = __decorate([
    (0, bull_1.Processor)(queue_config_1.QueueNames.NOTIFICATION)
], NotificationProcessor);
//# sourceMappingURL=notification.processor.js.map