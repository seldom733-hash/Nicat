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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RefundPaymentDto {
    paymentId;
    amount;
    reason;
}
exports.RefundPaymentDto = RefundPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID платежа' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundPaymentDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Сумма возврата (если не указана — полный возврат)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RefundPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Причина возврата',
        enum: ['duplicate', 'fraudulent', 'requested_by_customer'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['duplicate', 'fraudulent', 'requested_by_customer']),
    __metadata("design:type", String)
], RefundPaymentDto.prototype, "reason", void 0);
//# sourceMappingURL=refund-payment.dto.js.map