import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { StripeEvent } from './entities/stripe-event.entity';
import { Payout } from './entities/payout.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';
import { PricingEngine } from './pricing.engine';
import { BookingsModule } from '../bookings/bookings.module';
import { ToursModule } from '../tours/tours.module';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '../../core/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, StripeEvent, Payout]),
    forwardRef(() => BookingsModule),
    forwardRef(() => ToursModule),
    UsersModule,
    CacheModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService, PricingEngine],
  exports: [PaymentsService, PricingEngine, StripeService],
})
export class PaymentsModule {}
