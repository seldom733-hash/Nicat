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
exports.ItineraryItem = void 0;
const typeorm_1 = require("typeorm");
const tour_entity_1 = require("./tour.entity");
let ItineraryItem = class ItineraryItem {
    id;
    tour;
    tourId;
    dayNumber;
    sortOrder;
    title;
    description;
    startTime;
    endTime;
    location;
    notes;
};
exports.ItineraryItem = ItineraryItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ItineraryItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tour_entity_1.Tour, (tour) => tour.itinerary, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tourId' }),
    __metadata("design:type", tour_entity_1.Tour)
], ItineraryItem.prototype, "tour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "tourId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ItineraryItem.prototype, "dayNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ItineraryItem.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ItineraryItem.prototype, "notes", void 0);
exports.ItineraryItem = ItineraryItem = __decorate([
    (0, typeorm_1.Entity)('itinerary_items')
], ItineraryItem);
//# sourceMappingURL=itinerary-item.entity.js.map