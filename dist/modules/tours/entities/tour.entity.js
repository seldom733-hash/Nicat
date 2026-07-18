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
exports.Tour = void 0;
const typeorm_1 = require("typeorm");
const constants_1 = require("../../../common/constants");
const user_entity_1 = require("../../users/entities/user.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const itinerary_item_entity_1 = require("./itinerary-item.entity");
const tour_media_entity_1 = require("./tour-media.entity");
let Tour = class Tour {
    id;
    title;
    description;
    shortDescription;
    host;
    hostId;
    country;
    city;
    address;
    latitude;
    longitude;
    category;
    difficulty;
    language;
    minGroupSize;
    maxGroupSize;
    basePrice;
    currency;
    commissionRate;
    startDate;
    endDate;
    durationDays;
    status;
    isFeatured;
    bookingCount;
    averageRating;
    reviewCount;
    services;
    itinerary;
    media;
    bookings;
    createdAt;
    updatedAt;
};
exports.Tour = Tour;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tour.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Tour.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Tour.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Tour.prototype, "shortDescription", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.tours),
    (0, typeorm_1.JoinColumn)({ name: 'hostId' }),
    __metadata("design:type", user_entity_1.User)
], Tour.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Tour.prototype, "hostId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Tour.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Tour.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Tour.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Tour.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Tour.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.TourCategory,
        default: constants_1.TourCategory.CULTURAL,
    }),
    __metadata("design:type", String)
], Tour.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.DifficultyLevel,
        default: constants_1.DifficultyLevel.MODERATE,
    }),
    __metadata("design:type", String)
], Tour.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'en' }),
    __metadata("design:type", String)
], Tour.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Tour.prototype, "minGroupSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 20 }),
    __metadata("design:type", Number)
], Tour.prototype, "maxGroupSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Tour.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' }),
    __metadata("design:type", String)
], Tour.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 15 }),
    __metadata("design:type", Number)
], Tour.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Tour.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Tour.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Tour.prototype, "durationDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.TourStatus,
        default: constants_1.TourStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Tour.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Tour.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "bookingCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "averageRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: [] }),
    __metadata("design:type", Array)
], Tour.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => itinerary_item_entity_1.ItineraryItem, (item) => item.tour, { cascade: true }),
    __metadata("design:type", Array)
], Tour.prototype, "itinerary", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tour_media_entity_1.TourMedia, (media) => media.tour, { cascade: true }),
    __metadata("design:type", Array)
], Tour.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.tour),
    __metadata("design:type", Array)
], Tour.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Tour.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Tour.prototype, "updatedAt", void 0);
exports.Tour = Tour = __decorate([
    (0, typeorm_1.Entity)('tours'),
    (0, typeorm_1.Index)(['country', 'city']),
    (0, typeorm_1.Index)(['category']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['startDate', 'endDate'])
], Tour);
//# sourceMappingURL=tour.entity.js.map