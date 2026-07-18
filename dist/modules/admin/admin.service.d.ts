import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { UserRole, TourStatus, BookingStatus } from '../../common/constants';
export declare class AdminService {
    private readonly userRepository;
    private readonly tourRepository;
    private readonly bookingRepository;
    private readonly paymentRepository;
    constructor(userRepository: Repository<User>, tourRepository: Repository<Tour>, bookingRepository: Repository<Booking>, paymentRepository: Repository<Payment>);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            hosts: number;
            travelers: number;
        };
        tours: {
            total: number;
            active: number;
        };
        bookings: {
            total: number;
            confirmed: number;
        };
        revenue: {
            total: number;
            platform: number;
        };
    }>;
    getAllUsers(page?: number, limit?: number, role?: UserRole): Promise<{
        users: User[];
        total: number;
    }>;
    getAllTours(page?: number, limit?: number, status?: TourStatus): Promise<{
        tours: Tour[];
        total: number;
    }>;
    getAllBookings(page?: number, limit?: number, status?: BookingStatus): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    moderateTour(tourId: string, action: 'approve' | 'reject'): Promise<Tour>;
    updateUserStatus(userId: string, isActive: boolean): Promise<User>;
    getRevenueReport(startDate: string, endDate: string): Promise<any[]>;
}
