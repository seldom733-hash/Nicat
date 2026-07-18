import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Passenger } from './entities/passenger.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto, AddPassengerDto, RemovePassengerDto } from './dto/update-booking.dto';
import { ToursService } from '../tours/tours.service';
import { PricingEngine } from '../payments/pricing.engine';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly passengerRepository;
    private readonly toursService;
    private readonly pricingEngine;
    private readonly dataSource;
    constructor(bookingRepository: Repository<Booking>, passengerRepository: Repository<Passenger>, toursService: ToursService, pricingEngine: PricingEngine, dataSource: DataSource);
    create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking>;
    findById(id: string): Promise<Booking>;
    findByUser(userId: string, page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    findByTour(tourId: string, page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    updateStatus(id: string, updateBookingDto: UpdateBookingDto, userId: string): Promise<Booking>;
    addPassenger(bookingId: string, addPassengerDto: AddPassengerDto, userId: string): Promise<Booking>;
    removePassenger(bookingId: string, removePassengerDto: RemovePassengerDto, userId: string): Promise<Booking>;
    cancel(bookingId: string, userId: string, reason: string): Promise<Booking>;
    private generateBookingReference;
}
