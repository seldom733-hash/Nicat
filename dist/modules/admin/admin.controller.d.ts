import { AdminService } from './admin.service';
import { UserRole, TourStatus, BookingStatus } from '../../common/constants';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
        users: import("../users/entities").User[];
        total: number;
    }>;
    getAllTours(page?: number, limit?: number, status?: TourStatus): Promise<{
        tours: import("../tours/entities").Tour[];
        total: number;
    }>;
    getAllBookings(page?: number, limit?: number, status?: BookingStatus): Promise<{
        bookings: import("../bookings/entities").Booking[];
        total: number;
    }>;
    moderateTour(id: string, action: 'approve' | 'reject'): Promise<import("../tours/entities").Tour>;
    updateUserStatus(id: string, isActive: boolean): Promise<import("../users/entities").User>;
    getRevenueReport(startDate: string, endDate: string): Promise<any[]>;
}
