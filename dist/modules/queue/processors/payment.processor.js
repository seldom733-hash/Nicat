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
var PaymentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const queue_config_1 = require("../../../core/config/queue.config");
let PaymentProcessor = PaymentProcessor_1 = class PaymentProcessor {
    logger = new common_1.Logger(PaymentProcessor_1.name);
    async handleProcessPayment(job) {
        this.logger.log(`Обработка платежа для бронирования ${job.data.bookingId}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { success: true };
    }
    async handleWebhook(job) {
        this.logger.log(`Обработка webhook: ${job.data.eventType}`);
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
exports.PaymentProcessor = PaymentProcessor;
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.PROCESS_PAYMENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentProcessor.prototype, "handleProcessPayment", null);
__decorate([
    (0, bull_1.Process)(queue_config_1.JobNames.HANDLE_WEBHOOK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentProcessor.prototype, "handleWebhook", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], PaymentProcessor.prototype, "onFailed", null);
exports.PaymentProcessor = PaymentProcessor = PaymentProcessor_1 = __decorate([
    (0, bull_1.Processor)(queue_config_1.QueueNames.PAYMENT)
], PaymentProcessor);
//# sourceMappingURL=payment.processor.js.map