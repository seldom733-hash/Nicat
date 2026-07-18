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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tour_entity_1 = require("../tours/entities/tour.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const constants_1 = require("../../common/constants");
let DashboardService = class DashboardService {
    tourRepository;
    bookingRepository;
    paymentRepository;
    constructor(tourRepository, bookingRepository, paymentRepository) {
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }
    async getHostStats(hostId) {
        const totalTours = await this.tourRepository.count({ where: { hostId } });
        const activeTours = await this.tourRepository.count({
            where: { hostId, status: constants_1.TourStatus.ACTIVE },
        });
        const bookings = await this.bookingRepository
            .createQueryBuilder('booking')
            .innerJoin('booking.tour', 'tour')
            .where('tour.hostId = :hostId', { hostId })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [constants_1.BookingStatus.CONFIRMED, constants_1.BookingStatus.PAID, constants_1.BookingStatus.COMPLETED],
        })
            .getMany();
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalBasePrice), 0);
        const totalCommission = bookings.reduce((sum, b) => sum + Number(b.totalCommission), 0);
        return {
            tours: {
                total: totalTours,
                active: activeTours,
            },
            bookings: {
                total: totalBookings,
            },
            revenue: {
                total: totalRevenue,
                net: totalRevenue - totalCommission,
                commission: totalCommission,
            },
        };
    }
    async getHostTours(hostId, page = 1, limit = 10) {
        const [tours, total] = await this.tourRepository.findAndCount({
            where: { hostId },
            relations: { media: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { tours, total };
    }
    async getHostBookings(hostId, page = 1, limit = 10) {
        const [bookings, total] = await this.bookingRepository
            .createQueryBuilder('booking')
            .innerJoinAndSelect('booking.tour', 'tour')
            .innerJoinAndSelect('booking.user', 'user')
            .where('tour.hostId = :hostId', { hostId })
            .orderBy('booking.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { bookings, total };
    }
    async getRevenueAnalytics(hostId, startDate, endDate) {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .innerJoin('payment.booking', 'booking')
            .innerJoin('booking.tour', 'tour')
            .select('DATE(payment.createdAt)', 'date')
            .addSelect('SUM(payment.amount * 0.85)', 'revenue')
            .addSelect('COUNT(payment.id)', 'transactions')
            .where('tour.hostId = :hostId', { hostId })
            .andWhere('payment.status = :status', { status: 'succeeded' })
            .andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .groupBy('DATE(payment.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return result;
    }
    async getTourStats(tourId, hostId) {
        const tour = await this.tourRepository.findOne({ where: { id: tourId, hostId } });
        if (!tour) {
            return null;
        }
        const bookings = await this.bookingRepository.find({
            where: { tourId },
            relations: { passengers: true },
        });
        const totalBookings = bookings.length;
        const totalPassengers = bookings.reduce((sum, b) => sum + b.numberOfPassengers, 0);
        const revenue = bookings
            .filter((b) => ['paid', 'confirmed', 'completed'].includes(b.status))
            .reduce((sum, b) => sum + Number(b.totalBasePrice), 0);
        return {
            tour: {
                id: tour.id,
                title: tour.title,
                status: tour.status,
                averageRating: tour.averageRating,
                reviewCount: tour.reviewCount,
            },
            stats: {
                totalBookings,
                totalPassengers,
                revenue,
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tour_entity_1.Tour)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map