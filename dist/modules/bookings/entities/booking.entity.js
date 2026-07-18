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
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const constants_1 = require("../../../common/constants");
const user_entity_1 = require("../../users/entities/user.entity");
const tour_entity_1 = require("../../tours/entities/tour.entity");
const passenger_entity_1 = require("./passenger.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
let Booking = class Booking {
    id;
    bookingReference;
    user;
    userId;
    tour;
    tourId;
    numberOfPassengers;
    basePricePerPerson;
    commissionRate;
    commissionAmount;
    totalBasePrice;
    totalCommission;
    totalPrice;
    currency;
    status;
    tourDate;
    specialRequests;
    cancellationReason;
    cancelledAt;
    passengers;
    payments;
    stripePaymentIntentId;
    stripeTransferId;
    createdAt;
    updatedAt;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Booking.prototype, "bookingReference", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tour_entity_1.Tour, (tour) => tour.bookings),
    (0, typeorm_1.JoinColumn)({ name: 'tourId' }),
    __metadata("design:type", tour_entity_1.Tour)
], Booking.prototype, "tour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Booking.prototype, "tourId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfPassengers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "basePricePerPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "commissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalBasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalCommission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], Booking.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.BookingStatus,
        default: constants_1.BookingStatus.PENDING,
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Booking.prototype, "tourDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "specialRequests", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Booking.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => passenger_entity_1.Passenger, (passenger) => passenger.booking, { cascade: true }),
    __metadata("design:type", Array)
], Booking.prototype, "passengers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.booking),
    __metadata("design:type", Array)
], Booking.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "stripeTransferId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings'),
    (0, typeorm_1.Index)(['userId', 'status']),
    (0, typeorm_1.Index)(['tourId', 'status'])
], Booking);
//# sourceMappingURL=booking.entity.js.map