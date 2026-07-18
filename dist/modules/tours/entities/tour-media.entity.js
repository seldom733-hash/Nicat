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
exports.TourMedia = exports.MediaType = void 0;
const typeorm_1 = require("typeorm");
const tour_entity_1 = require("./tour.entity");
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
})(MediaType || (exports.MediaType = MediaType = {}));
let TourMedia = class TourMedia {
    id;
    tour;
    tourId;
    type;
    url;
    caption;
    sortOrder;
    isActive;
};
exports.TourMedia = TourMedia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TourMedia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tour_entity_1.Tour, (tour) => tour.media, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tourId' }),
    __metadata("design:type", tour_entity_1.Tour)
], TourMedia.prototype, "tour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TourMedia.prototype, "tourId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MediaType,
        default: MediaType.IMAGE,
    }),
    __metadata("design:type", String)
], TourMedia.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], TourMedia.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TourMedia.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TourMedia.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], TourMedia.prototype, "isActive", void 0);
exports.TourMedia = TourMedia = __decorate([
    (0, typeorm_1.Entity)('tour_media')
], TourMedia);
//# sourceMappingURL=tour-media.entity.js.map