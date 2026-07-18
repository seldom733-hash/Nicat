import { Repository } from 'typeorm';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { TourStatus } from '../../common/constants';
export declare class DashboardService {
    private readonly tourRepository;
    private readonly bookingRepository;
    private readonly paymentRepository;
    constructor(tourRepository: Repository<Tour>, bookingRepository: Repository<Booking>, paymentRepository: Repository<Payment>);
    getHostStats(hostId: string): Promise<{
        tours: {
            total: number;
            active: number;
        };
        bookings: {
            total: number;
        };
        revenue: {
            total: number;
            net: number;
            commission: number;
        };
    }>;
    getHostTours(hostId: string, page?: number, limit?: number): Promise<{
        tours: Tour[];
        total: number;
    }>;
    getHostBookings(hostId: string, page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    getRevenueAnalytics(hostId: string, startDate: string, endDate: string): Promise<any[]>;
    getTourStats(tourId: string, hostId: string): Promise<{
        tour: {
            id: string;
            title: string;
            status: TourStatus;
            averageRating: number;
            reviewCount: number;
        };
        stats: {
            totalBookings: number;
            totalPassengers: number;
            revenue: number;
        };
    } | null>;
}
