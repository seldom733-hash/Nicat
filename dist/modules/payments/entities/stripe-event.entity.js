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
exports.StripeEvent = exports.StripeEventStatus = void 0;
const typeorm_1 = require("typeorm");
var StripeEventStatus;
(function (StripeEventStatus) {
    StripeEventStatus["RECEIVED"] = "received";
    StripeEventStatus["PROCESSING"] = "processing";
    StripeEventStatus["PROCESSED"] = "processed";
    StripeEventStatus["FAILED"] = "failed";
    StripeEventStatus["IGNORED"] = "ignored";
})(StripeEventStatus || (exports.StripeEventStatus = StripeEventStatus = {}));
let StripeEvent = class StripeEvent {
    id;
    stripeEventId;
    eventType;
    status;
    payload;
    metadata;
    errorMessage;
    retryCount;
    processedAt;
    createdAt;
};
exports.StripeEvent = StripeEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StripeEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], StripeEvent.prototype, "stripeEventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], StripeEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StripeEventStatus,
        default: StripeEventStatus.RECEIVED,
    }),
    __metadata("design:type", String)
], StripeEvent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], StripeEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], StripeEvent.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StripeEvent.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StripeEvent.prototype, "retryCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], StripeEvent.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StripeEvent.prototype, "createdAt", void 0);
exports.StripeEvent = StripeEvent = __decorate([
    (0, typeorm_1.Entity)('stripe_events'),
    (0, typeorm_1.Index)(['stripeEventId'], { unique: true }),
    (0, typeorm_1.Index)(['eventType']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['createdAt'])
], StripeEvent);
//# sourceMappingURL=stripe-event.entity.js.map