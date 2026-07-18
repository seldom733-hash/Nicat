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
exports.Payout = exports.PayoutStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "pending";
    PayoutStatus["IN_TRANSIT"] = "in_transit";
    PayoutStatus["PAID"] = "paid";
    PayoutStatus["FAILED"] = "failed";
    PayoutStatus["CANCELLED"] = "cancelled";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
let Payout = class Payout {
    id;
    user;
    userId;
    stripePayoutId;
    amount;
    currency;
    status;
    type;
    arrivalDate;
    failureReason;
    balanceTransactionId;
    createdAt;
};
exports.Payout = Payout;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Payout.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Payout.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Payout.prototype, "stripePayoutId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payout.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], Payout.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PayoutStatus,
        default: PayoutStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Payout.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Payout.prototype, "arrivalDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Payout.prototype, "failureReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Payout.prototype, "balanceTransactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payout.prototype, "createdAt", void 0);
exports.Payout = Payout = __decorate([
    (0, typeorm_1.Entity)('payouts'),
    (0, typeorm_1.Index)(['userId', 'status']),
    (0, typeorm_1.Index)(['stripePayoutId']),
    (0, typeorm_1.Index)(['createdAt'])
], Payout);
//# sourceMappingURL=payout.entity.js.map