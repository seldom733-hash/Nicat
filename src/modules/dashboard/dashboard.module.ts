import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Tour } from '../tours/entities/tour.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';
import { TourView } from './entities/tour-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Booking, Payment, TourView])],
  controllers: [DashboardController, AnalyticsController],
  providers: [DashboardService, AnalyticsService],
  exports: [AnalyticsService],
})
export class DashboardModule {}
