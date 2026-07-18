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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const queue_config_1 = require("../../../core/config/queue.config");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor {
    logger = new common_1.Logger(EmailProcessor_1.name);
    async handleWelcomeEmail(job) {
        this.logger.log(`Обработка welcome email для ${job.data.email}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { success: true };
    }
    async handleBookingConfirmation(job) {
        this.logger.log(`Обработка booking confirmation для ${job.data.email}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { success: true };
    }
    async handlePaymentReceipt(job) {
        this.logger.log(`Обработка payment receipt для ${job.data.email}`);
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
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.SEND_WELCOME_EMAIL),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handleWelcomeEmail", null);
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.SEND_BOOKING_CONFIRMATION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handleBookingConfirmation", null);
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.SEND_PAYMENT_RECEIPT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handlePaymentReceipt", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EmailProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], EmailProcessor.prototype, "onFailed", null);
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bull_1.Processor)(queue_config_1.QueueNames.EMAIL)
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map