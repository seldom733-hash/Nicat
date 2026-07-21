import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { TourView } from './entities/tour-view.entity';
import { TourStatus, BookingStatus, PaymentStatus } from '../../common/constants';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepo: Repository<Tour>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(TourView)
    private readonly viewRepo: Repository<TourView>,
  ) {}

  /**
   * Sales funnel: views → bookings started → paid → confirmed → completed
   */
  async getFunnel(hostId: string, tourId?: string) {
    const tourFilter = tourId
      ? 'AND t.id = :tourId'
      : '';
    const params: Record<string, any> = { hostId };
    if (tourId) params.tourId = tourId;

    // 1. Total views
    const viewsQuery = this.viewRepo
      .createQueryBuilder('v')
      .innerJoin('v.tour', 't')
      .where(`t.hostId = :hostId ${tourFilter}`, params);

    const totalViews = await viewsQuery.getCount();

    // 2. Unique visitors
    const uniqueVisitors = await this.viewRepo
      .createQueryBuilder('v')
      .innerJoin('v.tour', 't')
      .where(`t.hostId = :hostId ${tourFilter}`, params)
      .select('COUNT(DISTINCT COALESCE(v.userId, v.id))')
      .getRawOne();

    // 3. Bookings started (all bookings)
    const bookingsStarted = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.tour', 't')
      .where(`t.hostId = :hostId ${tourFilter}`, params)
      .getCount();

    // 4. Paid bookings
    const bookingsPaid = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.tour', 't')
      .where(`t.hostId = :hostId ${tourFilter}`, params)
      .andWhere('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PAID, BookingStatus.COMPLETED],
      })
      .getCount();

    // 5. Completed bookings
    const bookingsCompleted = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.tour', 't')
      .where(`t.hostId = :hostId ${tourFilter}`, params)
      .andWhere('b.status = :status', { status: BookingStatus.COMPLETED })
      .getCount();

    // 6. Cancelled bookings
    const bookingsCancelled = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.tour', 't')
      .where(`t.hostId = :hostId ${tourFilter}`, params)
      .andWhere('b.status = :status', { status: BookingStatus.CANCELLED })
      .getCount();

    const totalBookings = bookingsStarted;
    const conversionRate = totalViews > 0 ? ((bookingsPaid / totalViews) * 100).toFixed(2) : '0';

    return {
      funnel: {
        views: totalViews,
        uniqueVisitors: parseInt(uniqueVisitors?.count || '0'),
        bookingsStarted: totalBookings,
        bookingsPaid,
        bookingsCompleted,
        bookingsCancelled,
      },
      conversion: {
        viewToBooking: totalViews > 0 ? ((bookingsStarted / totalViews) * 100).toFixed(2) : '0',
        bookingToPaid: bookingsStarted > 0 ? ((bookingsPaid / bookingsStarted) * 100).toFixed(2) : '0',
        paidToCompleted: bookingsPaid > 0 ? ((bookingsCompleted / bookingsPaid) * 100).toFixed(2) : '0',
        overallConversion: conversionRate,
      },
    };
  }

  /**
   * Revenue analytics over time
   */
  async getRevenueChart(hostId: string, period: 'day' | 'week' | 'month' = 'day', days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dateFormat = period === 'month' ? 'YYYY-MM' : period === 'week' ? 'YYYY-WW' : 'YYYY-MM-DD';

    const data = await this.paymentRepo
      .createQueryBuilder('p')
      .innerJoin('p.booking', 'b')
      .innerJoin('b.tour', 't')
      .select(`TO_CHAR(p.createdAt, '${dateFormat}')`, 'date')
      .addSelect('SUM(p.amount)', 'grossRevenue')
      .addSelect('SUM(p.amount * (1 - b.commissionRate / 100))', 'netRevenue')
      .addSelect('SUM(b.commissionAmount)', 'commission')
      .addSelect('COUNT(p.id)', 'transactions')
      .where('t.hostId = :hostId', { hostId })
      .andWhere('p.status = :status', { status: PaymentStatus.SUCCEEDED })
      .andWhere('p.createdAt >= :startDate', { startDate })
      .groupBy(`TO_CHAR(p.createdAt, '${dateFormat}')`)
      .orderBy('date', 'ASC')
      .getRawMany();

    return data;
  }

  /**
   * Tour performance stats
   */
  async getTourPerformance(hostId: string) {
    const tours = await this.tourRepo.find({
      where: { hostId },
      order: { bookingCount: 'DESC' },
    });

    const tourIds = tours.map((t) => t.id);
    if (tourIds.length === 0) return [];

    // Get views per tour
    const viewsPerTour = await this.viewRepo
      .createQueryBuilder('v')
      .select('v.tourId', 'tourId')
      .addSelect('COUNT(*)', 'views')
      .addSelect('COUNT(DISTINCT COALESCE(v.userId, v.id))', 'uniqueVisitors')
      .where('v.tourId IN (:...tourIds)', { tourIds })
      .groupBy('v.tourId')
      .getRawMany();

    const viewsMap = new Map(viewsPerTour.map((v) => [v.tourId, { views: parseInt(v.views), uniqueVisitors: parseInt(v.uniqueVisitors) }]));

    // Get bookings per tour
    const bookingsPerTour = await this.bookingRepo
      .createQueryBuilder('b')
      .select('b.tourId', 'tourId')
      .addSelect('COUNT(*)', 'totalBookings')
      .addSelect('SUM(CASE WHEN b.status IN (:...paid) THEN 1 ELSE 0 END)', 'paidBookings')
      .addSelect('SUM(b.totalBasePrice)', 'revenue')
      .where('b.tourId IN (:...tourIds)', { tourIds })
      .setParameter('paid', [BookingStatus.CONFIRMED, BookingStatus.PAID, BookingStatus.COMPLETED])
      .groupBy('b.tourId')
      .getRawMany();

    const bookingsMap = new Map(bookingsPerTour.map((b) => [b.tourId, {
      totalBookings: parseInt(b.totalBookings),
      paidBookings: parseInt(b.paidBookings || '0'),
      revenue: parseFloat(b.revenue || '0'),
    }]));

    return tours.map((tour) => {
      const views = viewsMap.get(tour.id) || { views: 0, uniqueVisitors: 0 };
      const bookings = bookingsMap.get(tour.id) || { totalBookings: 0, paidBookings: 0, revenue: 0 };
      const conversionRate = views.views > 0 ? ((bookings.paidBookings / views.views) * 100).toFixed(2) : '0';

      return {
        id: tour.id,
        title: tour.title,
        status: tour.status,
        category: tour.category,
        basePrice: tour.basePrice,
        averageRating: tour.averageRating,
        reviewCount: tour.reviewCount,
        views: views.views,
        uniqueVisitors: views.uniqueVisitors,
        totalBookings: bookings.totalBookings,
        paidBookings: bookings.paidBookings,
        revenue: bookings.revenue,
        conversionRate,
      };
    });
  }

  /**
   * Geography breakdown — where bookings come from
   */
  async getGeography(hostId: string) {
    const data = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.tour', 't')
      .innerJoin('b.user', 'u')
      .select('t.country', 'tourCountry')
      .addSelect('COUNT(b.id)', 'bookings')
      .addSelect('SUM(b.totalBasePrice)', 'revenue')
      .addSelect('COUNT(DISTINCT b.userId)', 'uniqueUsers')
      .where('t.hostId = :hostId', { hostId })
      .andWhere('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PAID, BookingStatus.COMPLETED],
      })
      .groupBy('t.country')
      .orderBy('bookings', 'DESC')
      .getRawMany();

    return data;
  }

  /**
   * Source breakdown — how visitors find tours
   */
  async getSources(hostId: string) {
    const data = await this.viewRepo
      .createQueryBuilder('v')
      .innerJoin('v.tour', 't')
      .select('v.source', 'source')
      .addSelect('COUNT(*)', 'views')
      .addSelect('COUNT(DISTINCT COALESCE(v.userId, v.id))', 'uniqueVisitors')
      .where('t.hostId = :hostId', { hostId })
      .groupBy('v.source')
      .orderBy('views', 'DESC')
      .getRawMany();

    return data;
  }

  /**
   * Monthly summary for dashboard cards
   */
  async getMonthlySummary(hostId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentMonth, lastMonth] = await Promise.all([
      this.getMonthData(hostId, startOfMonth, now),
      this.getMonthData(hostId, startOfLastMonth, endOfLastMonth),
    ]);

    const revenueGrowth = lastMonth.revenue > 0
      ? (((currentMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1)
      : currentMonth.revenue > 0 ? '100' : '0';

    const bookingsGrowth = lastMonth.bookings > 0
      ? (((currentMonth.bookings - lastMonth.bookings) / lastMonth.bookings) * 100).toFixed(1)
      : currentMonth.bookings > 0 ? '100' : '0';

    return {
      currentMonth,
      lastMonth,
      growth: {
        revenue: parseFloat(revenueGrowth),
        bookings: parseFloat(bookingsGrowth),
      },
    };
  }

  private async getMonthData(hostId: string, start: Date, end: Date) {
    const bookings = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.tour', 't')
      .where('t.hostId = :hostId', { hostId })
      .andWhere('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.PAID, BookingStatus.COMPLETED],
      })
      .andWhere('b.createdAt BETWEEN :start AND :end', { start, end })
      .getMany();

    return {
      bookings: bookings.length,
      revenue: bookings.reduce((sum, b) => sum + Number(b.totalBasePrice), 0),
      passengers: bookings.reduce((sum, b) => sum + b.numberOfPassengers, 0),
    };
  }
}
