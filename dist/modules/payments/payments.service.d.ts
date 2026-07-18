import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { StripeEvent } from './entities/stripe-event.entity';
import { Payout } from './entities/payout.entity';
import { StripeService } from './stripe.service';
import { BookingsService } from '../bookings/bookings.service';
import { ToursService } from '../tours/tours.service';
import { UsersService } from '../users/users.service';
import { PricingEngine } from './pricing.engine';
import { CacheService } from '../../core/cache/cache.service';
import Stripe from 'stripe';
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly stripeEventRepository;
    private readonly payoutRepository;
    private readonly stripeService;
    private readonly bookingsService;
    private readonly toursService;
    private readonly usersService;
    private readonly pricingEngine;
    private readonly cacheService;
    private readonly dataSource;
    private readonly logger;
    constructor(paymentRepository: Repository<Payment>, stripeEventRepository: Repository<StripeEvent>, payoutRepository: Repository<Payout>, stripeService: StripeService, bookingsService: BookingsService, toursService: ToursService, usersService: UsersService, pricingEngine: PricingEngine, cacheService: CacheService, dataSource: DataSource);
    getPaymentById(paymentId: string): Promise<Payment>;
    getPaymentByBookingId(bookingId: string): Promise<Payment | null>;
    getStripeConnectStatus(userId: string): Promise<{
        isConnected: boolean;
        accountId?: string;
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
        detailsSubmitted: boolean;
    }>;
    initiatePayment(bookingId: string, userId: string, useCheckoutSession?: boolean, successUrl?: string, cancelUrl?: string): Promise<{
        clientSecret?: string;
        paymentIntentId?: string;
        checkoutSessionId?: string;
        checkoutUrl?: string;
    }>;
    private createDirectPayment;
    private createCheckoutSessionPayment;
    handleWebhook(event: Stripe.Event): Promise<void>;
    private processWebhookEvent;
    private handlePaymentSuccess;
    private handlePaymentFailure;
    private handlePaymentCanceled;
    private handleChargeSucceeded;
    private handleChargeRefunded;
    private handleDisputeCreated;
    private handleCheckoutCompleted;
    private handleCheckoutExpired;
    private handleAccountUpdated;
    private handlePayoutPaid;
    private handlePayoutFailed;
    refundPayment(paymentId: string, userId: string, amount?: number, reason?: string): Promise<Payment>;
    requestPayout(userId: string, amount: number): Promise<Payout>;
    getPayoutHistory(userId: string, page?: number, limit?: number): Promise<{
        payouts: Payout[];
        total: number;
    }>;
    getPaymentHistory(userId: string, page?: number, limit?: number): Promise<{
        payments: Payment[];
        total: number;
    }>;
    getWebhookEvents(page?: number, limit?: number, eventType?: string): Promise<{
        events: StripeEvent[];
        total: number;
    }>;
    getFailedWebhookEvents(): Promise<StripeEvent[]>;
    retryWebhookEvent(eventId: string): Promise<void>;
}
