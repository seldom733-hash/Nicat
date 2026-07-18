import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tour, Booking, Payment])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
