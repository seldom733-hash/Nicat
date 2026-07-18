import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { UserRole, TourStatus, BookingStatus } from '../../common/constants';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count();
    const totalHosts = await this.userRepository.count({ where: { role: UserRole.HOST } });
    const totalTours = await this.tourRepository.count();
    const activeTours = await this.tourRepository.count({ where: { status: TourStatus.ACTIVE } });
    const totalBookings = await this.bookingRepository.count();
    const confirmedBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.CONFIRMED },
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

  async getAllUsers(page = 1, limit = 10, role?: UserRole) {
    const where = role ? { role } : {};
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { users, total };
  }

  async getAllTours(page = 1, limit = 10, status?: TourStatus) {
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

  async getAllBookings(page = 1, limit = 10, status?: BookingStatus) {
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

  async moderateTour(tourId: string, action: 'approve' | 'reject'): Promise<Tour> {
    const tour = await this.tourRepository.findOne({ where: { id: tourId } });
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    if (action === 'approve') {
      tour.status = TourStatus.ACTIVE;
    } else {
      tour.status = TourStatus.PAUSED;
    }

    return this.tourRepository.save(tour);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    return this.userRepository.save(user);
  }

  async getRevenueReport(startDate: string, endDate: string) {
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
}
