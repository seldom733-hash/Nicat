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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const passenger_entity_1 = require("./entities/passenger.entity");
const constants_1 = require("../../common/constants");
const tours_service_1 = require("../tours/tours.service");
const pricing_engine_1 = require("../payments/pricing.engine");
let BookingsService = class BookingsService {
    bookingRepository;
    passengerRepository;
    toursService;
    pricingEngine;
    dataSource;
    constructor(bookingRepository, passengerRepository, toursService, pricingEngine, dataSource) {
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.toursService = toursService;
        this.pricingEngine = pricingEngine;
        this.dataSource = dataSource;
    }
    async create(createBookingDto, userId) {
        const tour = await this.toursService.findById(createBookingDto.tourId);
        if (createBookingDto.numberOfPassengers > tour.maxGroupSize) {
            throw new common_1.BadRequestException(`Maximum group size is ${tour.maxGroupSize}`);
        }
        if (createBookingDto.numberOfPassengers < tour.minGroupSize) {
            throw new common_1.BadRequestException(`Minimum group size is ${tour.minGroupSize}`);
        }
        const pricing = this.pricingEngine.calculateTotalPrice(tour.basePrice, createBookingDto.numberOfPassengers, tour.commissionRate);
        const bookingReference = this.generateBookingReference();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const booking = this.bookingRepository.create({
                bookingReference,
                userId,
                tourId: tour.id,
                numberOfPassengers: createBookingDto.numberOfPassengers,
                basePricePerPerson: tour.basePrice,
                commissionRate: tour.commissionRate,
                commissionAmount: pricing.platformCommission,
                totalBasePrice: pricing.subtotal,
                totalCommission: pricing.platformCommission,
                totalPrice: pricing.totalPrice,
                currency: tour.currency,
                tourDate: new Date(createBookingDto.tourDate),
                specialRequests: createBookingDto.specialRequests,
                status: constants_1.BookingStatus.PENDING,
            });
            const savedBooking = await queryRunner.manager.save(booking);
            const passengers = createBookingDto.passengers.map((passengerDto, index) => this.passengerRepository.create({
                ...passengerDto,
                bookingId: savedBooking.id,
                isLeadPassenger: index === 0,
            }));
            await queryRunner.manager.save(passengers);
            await this.toursService.incrementBookingCount(tour.id);
            await queryRunner.commitTransaction();
            return this.findById(savedBooking.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findById(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: { user: true, tour: true, passengers: true, payments: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async findByUser(userId, page = 1, limit = 10) {
        const [bookings, total] = await this.bookingRepository.findAndCount({
            where: { userId },
            relations: { tour: true, passengers: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { bookings, total };
    }
    async findByTour(tourId, page = 1, limit = 10) {
        const [bookings, total] = await this.bookingRepository.findAndCount({
            where: { tourId },
            relations: { user: true, passengers: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { bookings, total };
    }
    async updateStatus(id, updateBookingDto, userId) {
        const booking = await this.findById(id);
        if (updateBookingDto.status === constants_1.BookingStatus.CANCELLED) {
            if (!updateBookingDto.cancellationReason) {
                throw new common_1.BadRequestException('Cancellation reason is required');
            }
            booking.cancelledAt = new Date();
            booking.cancellationReason = updateBookingDto.cancellationReason;
        }
        booking.status = updateBookingDto.status || booking.status;
        if (updateBookingDto.specialRequests) {
            booking.specialRequests = updateBookingDto.specialRequests;
        }
        return this.bookingRepository.save(booking);
    }
    async addPassenger(bookingId, addPassengerDto, userId) {
        const booking = await this.findById(bookingId);
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('You can only modify your own bookings');
        }
        if (booking.status !== constants_1.BookingStatus.PENDING && booking.status !== constants_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Cannot add passengers to this booking');
        }
        const tour = await this.toursService.findById(booking.tourId);
        if (booking.numberOfPassengers + 1 > tour.maxGroupSize) {
            throw new common_1.BadRequestException('Cannot exceed maximum group size');
        }
        const passenger = this.passengerRepository.create({
            ...addPassengerDto,
            bookingId: booking.id,
            isLeadPassenger: false,
        });
        await this.passengerRepository.save(passenger);
        booking.numberOfPassengers += 1;
        const pricing = this.pricingEngine.calculateTotalPrice(booking.basePricePerPerson, booking.numberOfPassengers, booking.commissionRate);
        booking.totalBasePrice = pricing.subtotal;
        booking.totalCommission = pricing.platformCommission;
        booking.totalPrice = pricing.totalPrice;
        return this.bookingRepository.save(booking);
    }
    async removePassenger(bookingId, removePassengerDto, userId) {
        const booking = await this.findById(bookingId);
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('You can only modify your own bookings');
        }
        if (booking.status !== constants_1.BookingStatus.PENDING && booking.status !== constants_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Cannot remove passengers from this booking');
        }
        const passenger = await this.passengerRepository.findOne({
            where: { id: removePassengerDto.passengerId, bookingId },
        });
        if (!passenger) {
            throw new common_1.NotFoundException('Passenger not found');
        }
        if (passenger.isLeadPassenger) {
            throw new common_1.BadRequestException('Cannot remove the lead passenger');
        }
        const tour = await this.toursService.findById(booking.tourId);
        if (booking.numberOfPassengers - 1 < tour.minGroupSize) {
            throw new common_1.BadRequestException('Cannot go below minimum group size');
        }
        await this.passengerRepository.remove(passenger);
        booking.numberOfPassengers -= 1;
        const pricing = this.pricingEngine.calculateTotalPrice(booking.basePricePerPerson, booking.numberOfPassengers, booking.commissionRate);
        booking.totalBasePrice = pricing.subtotal;
        booking.totalCommission = pricing.platformCommission;
        booking.totalPrice = pricing.totalPrice;
        return this.bookingRepository.save(booking);
    }
    async cancel(bookingId, userId, reason) {
        const booking = await this.findById(bookingId);
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own bookings');
        }
        if (booking.status === constants_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        booking.status = constants_1.BookingStatus.CANCELLED;
        booking.cancellationReason = reason;
        booking.cancelledAt = new Date();
        return this.bookingRepository.save(booking);
    }
    generateBookingReference() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `NC-${timestamp}-${random}`;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(passenger_entity_1.Passenger)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        tours_service_1.ToursService,
        pricing_engine_1.PricingEngine,
        typeorm_2.DataSource])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map