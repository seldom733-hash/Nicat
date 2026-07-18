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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const constants_1 = require("../../../common/constants");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Payment = class Payment {
    id;
    booking;
    bookingId;
    payer;
    payerId;
    amount;
    currency;
    status;
    stripePaymentIntentId;
    stripeChargeId;
    stripeTransferId;
    paymentMethod;
    failureReason;
    paidAt;
    refundedAt;
    createdAt;
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, (booking) => booking.payments),
    (0, typeorm_1.JoinColumn)({ name: 'bookingId' }),
    __metadata("design:type", booking_entity_1.Booking)
], Payment.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Payment.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'payerId' }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "payer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Payment.prototype, "payerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.PaymentStatus,
        default: constants_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripeChargeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripeTransferId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "refundedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('payments'),
    (0, typeorm_1.Index)(['bookingId', 'status']),
    (0, typeorm_1.Index)(['stripePaymentIntentId'])
], Payment);
//# sourceMappingURL=payment.entity.js.map