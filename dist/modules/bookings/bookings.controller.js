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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async create(createBookingDto, req) {
        return this.bookingsService.create(createBookingDto, req.user.id);
    }
    async findByUser(req, page, limit) {
        return this.bookingsService.findByUser(req.user.id, page, limit);
    }
    async findByTour(tourId, page, limit) {
        return this.bookingsService.findByTour(tourId, page, limit);
    }
    async findOne(id) {
        return this.bookingsService.findById(id);
    }
    async updateStatus(id, updateBookingDto, req) {
        return this.bookingsService.updateStatus(id, updateBookingDto, req.user.id);
    }
    async addPassenger(id, addPassengerDto, req) {
        return this.bookingsService.addPassenger(id, addPassengerDto, req.user.id);
    }
    async removePassenger(id, removePassengerDto, req) {
        return this.bookingsService.removePassenger(id, removePassengerDto, req.user.id);
    }
    async cancel(id, reason, req) {
        return this.bookingsService.cancel(id, req.user.id, reason);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('tour/:tourId'),
    __param(0, (0, common_1.Param)('tourId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findByTour", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/passengers'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.AddPassengerDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "addPassenger", null);
__decorate([
    (0, common_1.Put)(':id/passengers/remove'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.RemovePassengerDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "removePassenger", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancel", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map