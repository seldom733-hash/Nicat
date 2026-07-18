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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const tour_entity_1 = require("../tours/entities/tour.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const constants_1 = require("../../common/constants");
let AdminService = class AdminService {
    userRepository;
    tourRepository;
    bookingRepository;
    paymentRepository;
    constructor(userRepository, tourRepository, bookingRepository, paymentRepository) {
        this.userRepository = userRepository;
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }
    async getDashboardStats() {
        const totalUsers = await this.userRepository.count();
        const totalHosts = await this.userRepository.count({ where: { role: constants_1.UserRole.HOST } });
        const totalTours = await this.tourRepository.count();
        const activeTours = await this.tourRepository.count({ where: { status: constants_1.TourStatus.ACTIVE } });
        const totalBookings = await this.bookingRepository.count();
        const confirmedBookings = await this.bookingRepository.count({
            where: { status: constants_1.BookingStatus.CONFIRMED },
        });
        const revenueResult = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'totalRevenue')
            .addSelect('SUM(payment.amount * 0.15)', 'platformRevenue')
            .where('payment.status = :status', { status: 'succeeded' })
            .getRawOne();
        return {
            users: {
                total: totalUsers,
                hosts: totalHosts,
                travelers: totalUsers - totalHosts,
            },
            tours: {
                total: totalTours,
                active: activeTours,
            },
            bookings: {
                total: totalBookings,
                confirmed: confirmedBookings,
            },
            revenue: {
                total: parseFloat(revenueResult?.totalRevenue) || 0,
                platform: parseFloat(revenueResult?.platformRevenue) || 0,
            },
        };
    }
    async getAllUsers(page = 1, limit = 10, role) {
        const where = role ? { role } : {};
        const [users, total] = await this.userRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { users, total };
    }
    async getAllTours(page = 1, limit = 10, status) {
        const where = status ? { status } : {};
        const [tours, total] = await this.tourRepository.findAndCount({
            where,
            relations: { host: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { tours, total };
    }
    async getAllBookings(page = 1, limit = 10, status) {
        const where = status ? { status } : {};
        const [bookings, total] = await this.bookingRepository.findAndCount({
            where,
            relations: { user: true, tour: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { bookings, total };
    }
    async moderateTour(tourId, action) {
        const tour = await this.tourRepository.findOne({ where: { id: tourId } });
        if (!tour) {
            throw new common_1.NotFoundException('Tour not found');
        }
        if (action === 'approve') {
            tour.status = constants_1.TourStatus.ACTIVE;
        }
        else {
            tour.status = constants_1.TourStatus.PAUSED;
        }
        return this.tourRepository.save(tour);
    }
    async updateUserStatus(userId, isActive) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.isActive = isActive;
        return this.userRepository.save(user);
    }
    async getRevenueReport(startDate, endDate) {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('DATE(payment.createdAt)', 'date')
            .addSelect('SUM(payment.amount)', 'revenue')
            .addSelect('COUNT(payment.id)', 'transactions')
            .where('payment.status = :status', { status: 'succeeded' })
            .andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .groupBy('DATE(payment.createdAt)')
            .orderBy('date', 'ASC')
            .getRawMany();
        return result;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(tour_entity_1.Tour)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(3, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map