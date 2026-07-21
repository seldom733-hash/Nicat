import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Sales funnel: views → bookings started → paid → confirmed → completed
   */
  async getFunnel(hostId: string, tourId?: string, days?: number) {
    let tourFilter = tourId ? 'AND t.id = $2' : '';
    let dateFilter = '';
    const params: any[] = [hostId];
    let paramIdx = 2;
    if (tourId) {
      params.push(tourId);
      paramIdx = 3;
    }
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = ` AND v."viewedAt" >= $${paramIdx}`;
      params.push(startDate.toISOString());
    }

    // 1. Total views
    const viewsResult = await this.dataSource.query(`
      SELECT COUNT(*)::int AS total
      FROM tour_views v
      INNER JOIN tours t ON v."tourId" = t.id
      WHERE t."hostId" = $1 ${tourFilter}${dateFilter}
    `, params);
    const totalViews = viewsResult[0]?.total ?? 0;

    // 2. Unique visitors
    const uniqueResult = await this.dataSource.query(`
      SELECT COUNT(DISTINCT COALESCE(v."userId"::text, v.id::text))::int AS total
      FROM tour_views v
      INNER JOIN tours t ON v."tourId" = t.id
      WHERE t."hostId" = $1 ${tourFilter}${dateFilter}
    `, params);
    const uniqueVisitors = uniqueResult[0]?.total ?? 0;

    // 3-6. Bookings counts
    let bookingDateFilter = '';
    const bookingParams: any[] = [hostId];
    let bParamIdx = 2;
    if (tourId) {
      bookingParams.push(tourId);
      bParamIdx = 3;
    }
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      bookingDateFilter = ` AND b."createdAt" >= $${bParamIdx}`;
      bookingParams.push(startDate.toISOString());
    }
    const baseWhere = `b."tourId" IN (SELECT id FROM tours WHERE "hostId" = $1${tourId ? ' AND id = $2' : ''})`;

    const bookingsStarted = await this.bookingCount(bookingParams, baseWhere, bookingDateFilter);
    const bookingsPaid = await this.bookingCount(bookingParams, baseWhere, `${bookingDateFilter} AND b.status IN ('confirmed','paid','completed')`);
    const bookingsCompleted = await this.bookingCount(bookingParams, baseWhere, `${bookingDateFilter} AND b.status = 'completed'`);
    const bookingsCancelled = await this.bookingCount(bookingParams, baseWhere, `${bookingDateFilter} AND b.status = 'cancelled'`);

    const conversionRate = totalViews > 0 ? ((bookingsPaid / totalViews) * 100).toFixed(2) : '0';

    return {
      funnel: {
        views: totalViews,
        uniqueVisitors,
        bookingsStarted,
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

  private async bookingCount(params: any[], baseWhere: string, extraWhere: string): Promise<number> {
    const result = await this.dataSource.query(`
      SELECT COUNT(*)::int AS total
      FROM bookings b
      WHERE ${baseWhere} ${extraWhere}
    `, params);
    return result[0]?.total ?? 0;
  }

  /**
   * Revenue analytics over time
   */
  async getRevenueChart(hostId: string, period: 'day' | 'week' | 'month' = 'day', days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dateFormat = period === 'month' ? 'YYYY-MM' : period === 'week' ? 'IYYY-IW' : 'YYYY-MM-DD';

    const data = await this.dataSource.query(`
      SELECT
        TO_CHAR(p."createdAt", '${dateFormat}') AS "date",
        SUM(p.amount)::numeric AS "grossRevenue",
        SUM(p.amount * (1 - b."commissionRate" / 100))::numeric AS "netRevenue",
        SUM(b."commissionAmount")::numeric AS "commission",
        COUNT(p.id)::int AS "transactions"
      FROM payments p
      INNER JOIN bookings b ON p."bookingId" = b.id
      INNER JOIN tours t ON b."tourId" = t.id
      WHERE t."hostId" = $1
        AND p.status = 'succeeded'
        AND p."createdAt" >= $2
      GROUP BY TO_CHAR(p."createdAt", '${dateFormat}')
      ORDER BY "date" ASC
    `, [hostId, startDate.toISOString()]);

    return data;
  }

  /**
   * Tour performance stats
   */
  async getTourPerformance(hostId: string, days?: number) {
    const tours = await this.dataSource.query(`
      SELECT
        t.id, t.title, t.status, t.category, t."basePrice",
        t."averageRating", t."reviewCount"
      FROM tours t
      WHERE t."hostId" = $1
      ORDER BY t."bookingCount" DESC
    `, [hostId]);

    if (tours.length === 0) return [];

    const tourIds = tours.map((_: any, i: number) => `$${i + 1}`);
    const tourIdParams = tours.map((t: any) => t.id);

    let dateFilter = '';
    const allParams: any[] = [...tourIdParams];
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = ` AND v."viewedAt" >= $${tourIds.length + 1}`;
      allParams.push(startDate.toISOString());
    }
    const viewsPerTour = await this.dataSource.query(`
      SELECT
        v."tourId",
        COUNT(*)::int AS views,
        COUNT(DISTINCT COALESCE(v."userId"::text, v.id::text))::int AS "uniqueVisitors"
      FROM tour_views v
      WHERE v."tourId" IN (${tourIds.join(',')})${dateFilter}
      GROUP BY v."tourId"
    `, allParams);

    const bookingsPerTour = await this.dataSource.query(`
      SELECT
        b."tourId",
        COUNT(*)::int AS "totalBookings",
        SUM(CASE WHEN b.status IN ('confirmed','paid','completed') THEN 1 ELSE 0 END)::int AS "paidBookings",
        SUM(b."totalBasePrice")::numeric AS revenue
      FROM bookings b
      WHERE b."tourId" IN (${tourIds.join(',')})${dateFilter ? ` AND b."createdAt" >= $${tourIds.length + 1}` : ''}
      GROUP BY b."tourId"
    `, allParams);

    const viewsMap = new Map<string, { views: number; uniqueVisitors: number }>(viewsPerTour.map((v: any) => [v.tourId, { views: v.views, uniqueVisitors: v.uniqueVisitors }]));
    const bookingsMap = new Map<string, { totalBookings: number; paidBookings: number; revenue: number }>(bookingsPerTour.map((b: any) => [b.tourId, {
      totalBookings: b.totalBookings,
      paidBookings: b.paidBookings || 0,
      revenue: parseFloat(b.revenue || '0'),
    }]));

    return tours.map((tour: any) => {
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
  async getGeography(hostId: string, days?: number) {
    let dateFilter = '';
    const params: any[] = [hostId];
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = ' AND b."createdAt" >= $2';
      params.push(startDate.toISOString());
    }
    const data = await this.dataSource.query(`
      SELECT
        t.country AS "tourCountry",
        COUNT(b.id)::int AS bookings,
        SUM(b."totalBasePrice")::numeric AS revenue,
        COUNT(DISTINCT b."userId")::int AS "uniqueUsers"
      FROM bookings b
      INNER JOIN tours t ON b."tourId" = t.id
      WHERE t."hostId" = $1
        AND b.status IN ('confirmed','paid','completed')${dateFilter}
      GROUP BY t.country
      ORDER BY bookings DESC
    `, params);

    return data;
  }

  /**
   * Source breakdown — how visitors find tours
   */
  async getSources(hostId: string, days?: number) {
    let dateFilter = '';
    const params: any[] = [hostId];
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = ' AND v."viewedAt" >= $2';
      params.push(startDate.toISOString());
    }
    const data = await this.dataSource.query(`
      SELECT
        v.source,
        COUNT(*)::int AS views,
        COUNT(DISTINCT COALESCE(v."userId"::text, v.id::text))::int AS "uniqueVisitors"
      FROM tour_views v
      INNER JOIN tours t ON v."tourId" = t.id
      WHERE t."hostId" = $1${dateFilter}
      GROUP BY v.source
      ORDER BY views DESC
    `, params);

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
    const result = await this.dataSource.query(`
      SELECT
        COUNT(*)::int AS bookings,
        COALESCE(SUM(b."totalBasePrice"), 0)::numeric AS revenue,
        COALESCE(SUM(b."numberOfPassengers"), 0)::int AS passengers
      FROM bookings b
      INNER JOIN tours t ON b."tourId" = t.id
      WHERE t."hostId" = $1
        AND b.status IN ('confirmed','paid','completed')
        AND b."createdAt" >= $2
        AND b."createdAt" <= $3
    `, [hostId, start.toISOString(), end.toISOString()]);

    const row = result[0] || { bookings: 0, revenue: 0, passengers: 0 };
    return {
      bookings: row.bookings,
      revenue: parseFloat(row.revenue || '0'),
      passengers: row.passengers,
    };
  }
}
