import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Passenger } from './entities/passenger.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ToursModule } from '../tours/tours.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Passenger]),
    forwardRef(() => ToursModule),
    forwardRef(() => PaymentsModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
