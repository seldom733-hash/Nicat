import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Booking, Payment])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
