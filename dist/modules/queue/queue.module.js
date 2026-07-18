"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const queue_service_1 = require("./queue.service");
const email_processor_1 = require("./processors/email.processor");
const payment_processor_1 = require("./processors/payment.processor");
const notification_processor_1 = require("./processors/notification.processor");
const queue_config_1 = require("../../core/config/queue.config");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    return (0, queue_config_1.getQueueConfig)(configService.get('REDIS_HOST', 'localhost'), configService.get('REDIS_PORT', 6379), configService.get('REDIS_PASSWORD'));
                },
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.registerQueue({ name: queue_config_1.QueueNames.EMAIL }, { name: queue_config_1.QueueNames.PAYMENT }, { name: queue_config_1.QueueNames.NOTIFICATION }, { name: queue_config_1.QueueNames.SEARCH_INDEX }, { name: queue_config_1.QueueNames.ANALYTICS }, { name: queue_config_1.QueueNames.FILE_UPLOAD }),
        ],
        providers: [queue_service_1.QueueService, email_processor_1.EmailProcessor, payment_processor_1.PaymentProcessor, notification_processor_1.NotificationProcessor],
        exports: [queue_service_1.QueueService, bull_1.BullModule],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map