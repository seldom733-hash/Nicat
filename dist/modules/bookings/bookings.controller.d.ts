import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto, AddPassengerDto, RemovePassengerDto } from './dto/update-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<import("./entities").Booking>;
    findByUser(req: any, page?: number, limit?: number): Promise<{
        bookings: import("./entities").Booking[];
        total: number;
    }>;
    findByTour(tourId: string, page?: number, limit?: number): Promise<{
        bookings: import("./entities").Booking[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities").Booking>;
    updateStatus(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<import("./entities").Booking>;
    addPassenger(id: string, addPassengerDto: AddPassengerDto, req: any): Promise<import("./entities").Booking>;
    removePassenger(id: string, removePassengerDto: RemovePassengerDto, req: any): Promise<import("./entities").Booking>;
    cancel(id: string, reason: string, req: any): Promise<import("./entities").Booking>;
}
