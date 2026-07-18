import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(req: any): Promise<{
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
    getTours(req: any, page?: number, limit?: number): Promise<{
        tours: import("../tours/entities").Tour[];
        total: number;
    }>;
    getBookings(req: any, page?: number, limit?: number): Promise<{
        bookings: import("../bookings/entities").Booking[];
        total: number;
    }>;
    getRevenueAnalytics(req: any, startDate: string, endDate: string): Promise<any[]>;
    getTourStats(tourId: string, req: any): Promise<{
        tour: {
            id: string;
            title: string;
            status: import("../../common/constants").TourStatus;
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
