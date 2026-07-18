import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { TourStatus, BookingStatus } from '../../common/constants';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getHostStats(hostId: string) {
    const totalTours = await this.tourRepository.count({ where: { hostId } });
    const activeTours = await this.tourRepository.count({
      where: { hostId, status: TourStatus.ACTIVE },
    });

    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoin('booking.tour', 'tour')
      .where('tour.hostId = :hostId', { hostId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PAID, BookingStatus.COMPLETED],
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

  async getHostTours(hostId: string, page = 1, limit = 10) {
    const [tours, total] = await this.tourRepository.findAndCount({
      where: { hostId },
      relations: { media: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { tours, total };
  }

  async getHostBookings(hostId: string, page = 1, limit = 10) {
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

  async getRevenueAnalytics(hostId: string, startDate: string, endDate: string) {
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

  async getTourStats(tourId: string, hostId: string) {
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
}
