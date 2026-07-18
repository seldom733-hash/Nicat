import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Passenger } from './entities/passenger.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto, AddPassengerDto, RemovePassengerDto } from './dto/update-booking.dto';
import { BookingStatus } from '../../common/constants';
import { ToursService } from '../tours/tours.service';
import { PricingEngine } from '../payments/pricing.engine';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    private readonly toursService: ToursService,
    private readonly pricingEngine: PricingEngine,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const tour = await this.toursService.findById(createBookingDto.tourId);

    if (createBookingDto.numberOfPassengers > tour.maxGroupSize) {
      throw new BadRequestException(`Maximum group size is ${tour.maxGroupSize}`);
    }

    if (createBookingDto.numberOfPassengers < tour.minGroupSize) {
      throw new BadRequestException(`Minimum group size is ${tour.minGroupSize}`);
    }

    const pricing = this.pricingEngine.calculateTotalPrice(
      tour.basePrice,
      createBookingDto.numberOfPassengers,
      tour.commissionRate,
    );

    const bookingReference = this.generateBookingReference();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = this.bookingRepository.create({
        bookingReference,
        userId,
        tourId: tour.id,
        numberOfPassengers: createBookingDto.numberOfPassengers,
        basePricePerPerson: tour.basePrice,
        commissionRate: tour.commissionRate,
        commissionAmount: pricing.platformCommission,
        totalBasePrice: pricing.subtotal,
        totalCommission: pricing.platformCommission,
        totalPrice: pricing.totalPrice,
        currency: tour.currency,
        tourDate: new Date(createBookingDto.tourDate),
        specialRequests: createBookingDto.specialRequests,
        status: BookingStatus.PENDING,
      });

      const savedBooking = await queryRunner.manager.save(booking);

      const passengers = createBookingDto.passengers.map((passengerDto, index) =>
        this.passengerRepository.create({
          ...passengerDto,
          bookingId: savedBooking.id,
          isLeadPassenger: index === 0,
        }),
      );

      await queryRunner.manager.save(passengers);
      await this.toursService.incrementBookingCount(tour.id);
      await queryRunner.commitTransaction();

      return this.findById(savedBooking.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: true, tour: true, passengers: true, payments: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findByUser(userId: string, page = 1, limit = 10): Promise<{ bookings: Booking[]; total: number }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { userId },
      relations: { tour: true, passengers: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { bookings, total };
  }

  async findByTour(tourId: string, page = 1, limit = 10): Promise<{ bookings: Booking[]; total: number }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { tourId },
      relations: { user: true, passengers: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { bookings, total };
  }

  async updateStatus(id: string, updateBookingDto: UpdateBookingDto, userId: string): Promise<Booking> {
    const booking = await this.findById(id);

    if (updateBookingDto.status === BookingStatus.CANCELLED) {
      if (!updateBookingDto.cancellationReason) {
        throw new BadRequestException('Cancellation reason is required');
      }
      booking.cancelledAt = new Date();
      booking.cancellationReason = updateBookingDto.cancellationReason;
    }

    booking.status = updateBookingDto.status || booking.status;
    if (updateBookingDto.specialRequests) {
      booking.specialRequests = updateBookingDto.specialRequests;
    }

    return this.bookingRepository.save(booking);
  }

  async addPassenger(bookingId: string, addPassengerDto: AddPassengerDto, userId: string): Promise<Booking> {
    const booking = await this.findById(bookingId);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only modify your own bookings');
    }

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot add passengers to this booking');
    }

    const tour = await this.toursService.findById(booking.tourId);
    if (booking.numberOfPassengers + 1 > tour.maxGroupSize) {
      throw new BadRequestException('Cannot exceed maximum group size');
    }

    const passenger = this.passengerRepository.create({
      ...addPassengerDto,
      bookingId: booking.id,
      isLeadPassenger: false,
    });

    await this.passengerRepository.save(passenger);

    booking.numberOfPassengers += 1;
    const pricing = this.pricingEngine.calculateTotalPrice(
      booking.basePricePerPerson,
      booking.numberOfPassengers,
      booking.commissionRate,
    );
    booking.totalBasePrice = pricing.subtotal;
    booking.totalCommission = pricing.platformCommission;
    booking.totalPrice = pricing.totalPrice;

    return this.bookingRepository.save(booking);
  }

  async removePassenger(bookingId: string, removePassengerDto: RemovePassengerDto, userId: string): Promise<Booking> {
    const booking = await this.findById(bookingId);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only modify your own bookings');
    }

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot remove passengers from this booking');
    }

    const passenger = await this.passengerRepository.findOne({
      where: { id: removePassengerDto.passengerId, bookingId },
    });

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    if (passenger.isLeadPassenger) {
      throw new BadRequestException('Cannot remove the lead passenger');
    }

    const tour = await this.toursService.findById(booking.tourId);
    if (booking.numberOfPassengers - 1 < tour.minGroupSize) {
      throw new BadRequestException('Cannot go below minimum group size');
    }

    await this.passengerRepository.remove(passenger);

    booking.numberOfPassengers -= 1;
    const pricing = this.pricingEngine.calculateTotalPrice(
      booking.basePricePerPerson,
      booking.numberOfPassengers,
      booking.commissionRate,
    );
    booking.totalBasePrice = pricing.subtotal;
    booking.totalCommission = pricing.platformCommission;
    booking.totalPrice = pricing.totalPrice;

    return this.bookingRepository.save(booking);
  }

  async cancel(bookingId: string, userId: string, reason: string): Promise<Booking> {
    const booking = await this.findById(bookingId);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();

    return this.bookingRepository.save(booking);
  }

  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `NC-${timestamp}-${random}`;
  }
}
