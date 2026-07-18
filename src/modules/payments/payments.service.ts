import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { StripeEvent, StripeEventStatus } from './entities/stripe-event.entity';
import { Payout, PayoutStatus } from './entities/payout.entity';
import { StripeService } from './stripe.service';
import { BookingsService } from '../bookings/bookings.service';
import { ToursService } from '../tours/tours.service';
import { UsersService } from '../users/users.service';
import { PricingEngine } from './pricing.engine';
import { CacheService } from '../../core/cache/cache.service';
import { BookingStatus, PaymentStatus } from '../../common/constants';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(StripeEvent)
    private readonly stripeEventRepository: Repository<StripeEvent>,
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    private readonly stripeService: StripeService,
    private readonly bookingsService: BookingsService,
    private readonly toursService: ToursService,
    private readonly usersService: UsersService,
    private readonly pricingEngine: PricingEngine,
    private readonly cacheService: CacheService,
    private readonly dataSource: DataSource,
  ) {}

  // ==================== Кэшированные методы ====================

  async getPaymentById(paymentId: string): Promise<Payment> {
    const cacheKey = `payment:${paymentId}`;
    const cached = await this.cacheService.get<Payment>(cacheKey);
    if (cached) return cached;

    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: { booking: true, payer: true },
    });

    if (!payment) {
      throw new NotFoundException('Платеж не найден');
    }

    await this.cacheService.set(cacheKey, payment, 300);
    return payment;
  }

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const cacheKey = `payment:booking:${bookingId}`;
    const cached = await this.cacheService.get<Payment>(cacheKey);
    if (cached) return cached;

    const payment = await this.paymentRepository.findOne({
      where: { bookingId },
      order: { createdAt: 'DESC' },
    });

    if (payment) {
      await this.cacheService.set(cacheKey, payment, 300);
    }

    return payment;
  }

  async getStripeConnectStatus(userId: string): Promise<{
    isConnected: boolean;
    accountId?: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
  }> {
    const cacheKey = `stripe:status:${userId}`;
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const user = await this.usersService.findById(userId);

    if (!user.stripeAccountId) {
      const result = {
        isConnected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      };
      await this.cacheService.set(cacheKey, result, 60);
      return result;
    }

    try {
      const account = await this.stripeService.getConnectedAccount(user.stripeAccountId);
      const result = {
        isConnected: true,
        accountId: account.id,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
      };
      await this.cacheService.set(cacheKey, result, 60);
      return result;
    } catch {
      const result = {
        isConnected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      };
      await this.cacheService.set(cacheKey, result, 60);
      return result;
    }
  }

  // ==================== Инициализация платежа ====================

  async initiatePayment(
    bookingId: string,
    userId: string,
    useCheckoutSession = false,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<{
    clientSecret?: string;
    paymentIntentId?: string;
    checkoutSessionId?: string;
    checkoutUrl?: string;
  }> {
    const booking = await this.bookingsService.findById(bookingId);

    if (booking.userId !== userId) {
      throw new BadRequestException('Нет доступа к этому бронированию');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Бронирование не в статусе ожидания');
    }

    const tour = await this.toursService.findById(booking.tourId);
    const host = await this.usersService.findById(tour.hostId);

    if (!host.stripeAccountId) {
      throw new BadRequestException('Хозяин тура не подключил Stripe');
    }

    const pricing = this.pricingEngine.calculateTotalPrice(
      tour.basePrice,
      booking.numberOfPassengers,
      tour.commissionRate,
    );

    if (useCheckoutSession) {
      return this.createCheckoutSessionPayment(
        booking,
        pricing,
        host.stripeAccountId,
        successUrl,
        cancelUrl,
      );
    }

    return this.createDirectPayment(
      booking,
      pricing,
      host.stripeAccountId,
    );
  }

  private async createDirectPayment(
    booking: any,
    pricing: any,
    connectedAccountId: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      pricing.totalPrice,
      booking.currency,
      connectedAccountId,
      booking.id,
      pricing.platformCommission,
      {
        bookingReference: booking.bookingReference,
        tourId: booking.tourId,
        numberOfPassengers: booking.numberOfPassengers.toString(),
      },
    );

    const payment = this.paymentRepository.create({
      bookingId: booking.id,
      payerId: booking.userId,
      amount: pricing.totalPrice,
      currency: booking.currency,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: paymentIntent.id,
    });

    await this.paymentRepository.save(payment);

    const updateDto: UpdateBookingDto = { status: BookingStatus.PENDING };
    await this.bookingsService.updateStatus(booking.id, updateDto, booking.userId);

    this.logger.log(`Платеж инициирован: ${paymentIntent.id} для бронирования ${booking.bookingReference}`);

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
    };
  }

  private async createCheckoutSessionPayment(
    booking: any,
    pricing: any,
    connectedAccountId: string,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<{ checkoutSessionId: string; checkoutUrl: string }> {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const session = await this.stripeService.createCheckoutSession(
      pricing.totalPrice,
      booking.currency,
      connectedAccountId,
      booking.id,
      pricing.platformCommission,
      successUrl || `${appUrl}/booking/success`,
      cancelUrl || `${appUrl}/booking/cancel`,
      undefined,
    );

    const payment = this.paymentRepository.create({
      bookingId: booking.id,
      payerId: booking.userId,
      amount: pricing.totalPrice,
      currency: booking.currency,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: session.payment_intent as string,
      paymentMethod: `checkout_session:${session.id}`,
    });

    await this.paymentRepository.save(payment);

    this.logger.log(`Checkout session создан: ${session.id} для бронирования ${booking.bookingReference}`);

    return {
      checkoutSessionId: session.id,
      checkoutUrl: session.url || '',
    };
  }

  // ==================== Webhook обработка ====================

  async handleWebhook(event: Stripe.Event): Promise<void> {
    const existingEvent = await this.stripeEventRepository.findOne({
      where: { stripeEventId: event.id },
    });

    if (existingEvent) {
      if (existingEvent.status === StripeEventStatus.PROCESSED) {
        return;
      }
      if (existingEvent.status === StripeEventStatus.PROCESSING) {
        return;
      }
    }

    const stripeEvent = this.stripeEventRepository.create({
      stripeEventId: event.id,
      eventType: event.type,
      status: StripeEventStatus.PROCESSING,
      payload: event.data.object,
      metadata: {
        apiVersion: (event as any).api_version,
        created: event.created,
      },
    });

    await this.stripeEventRepository.save(stripeEvent);

    try {
      await this.processWebhookEvent(event);

      stripeEvent.status = StripeEventStatus.PROCESSED;
      stripeEvent.processedAt = new Date();
      await this.stripeEventRepository.save(stripeEvent);
    } catch (error) {
      stripeEvent.status = StripeEventStatus.FAILED;
      stripeEvent.errorMessage = error.message;
      stripeEvent.retryCount += 1;
      await this.stripeEventRepository.save(stripeEvent);

      this.logger.error(`Ошибка обработки webhook ${event.type}: ${error.message}`);
      throw error;
    }
  }

  private async processWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.canceled':
        await this.handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.succeeded':
        await this.handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'charge.dispute.created':
        await this.handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'checkout.session.expired':
        await this.handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
      case 'account.updated':
        await this.handleAccountUpdated(event.data.object as Stripe.Account);
        break;
      case 'payout.paid':
        await this.handlePayoutPaid(event.data.object as Stripe.Payout);
        break;
      case 'payout.failed':
        await this.handlePayoutFailed(event.data.object as Stripe.Payout);
        break;
      default:
        this.logger.log(`Необработанное событие Stripe: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      payment.status = PaymentStatus.SUCCEEDED;
      payment.paidAt = new Date();
      payment.stripeChargeId = paymentIntent.latest_charge as string;
      await this.paymentRepository.save(payment);

      const updateDto: UpdateBookingDto = { status: BookingStatus.PAID };
      await this.bookingsService.updateStatus(payment.bookingId, updateDto, payment.payerId);

      await this.cacheService.del(`payment:${payment.id}`);
      await this.cacheService.del(`payment:booking:${payment.bookingId}`);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = paymentIntent.last_payment_error?.message || 'Неизвестная ошибка';
      await this.paymentRepository.save(payment);
    }
  }

  private async handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (payment) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Платеж отменен';
      await this.paymentRepository.save(payment);
    }
  }

  private async handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });

    if (payment && !payment.stripeChargeId) {
      payment.stripeChargeId = charge.id;
      await this.paymentRepository.save(payment);
    }
  }

  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { stripeChargeId: charge.id },
    });

    if (payment) {
      payment.status = PaymentStatus.REFUNDED;
      payment.refundedAt = new Date();
      await this.paymentRepository.save(payment);

      const updateDto: UpdateBookingDto = { status: BookingStatus.REFUNDED };
      await this.bookingsService.updateStatus(payment.bookingId, updateDto, payment.payerId);

      await this.cacheService.del(`payment:${payment.id}`);
    }
  }

  private async handleDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
    this.logger.warn(`Создан спор: ${dispute.id} на сумму ${dispute.amount / 100} ${dispute.currency}`);
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentMethod: `checkout_session:${session.id}` },
    });

    if (payment) {
      payment.status = PaymentStatus.SUCCEEDED;
      payment.paidAt = new Date();
      payment.stripePaymentIntentId = session.payment_intent as string;
      payment.stripeChargeId = session.payment_intent as string;
      await this.paymentRepository.save(payment);

      const updateDto: UpdateBookingDto = { status: BookingStatus.PAID };
      await this.bookingsService.updateStatus(payment.bookingId, updateDto, payment.payerId);

      await this.cacheService.del(`payment:${payment.id}`);
    }
  }

  private async handleCheckoutExpired(session: Stripe.Checkout.Session): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentMethod: `checkout_session:${session.id}` },
    });

    if (payment) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Checkout session истек';
      await this.paymentRepository.save(payment);
    }
  }

  private async handleAccountUpdated(account: Stripe.Account): Promise<void> {
    const users = await this.usersService.findByStripeAccountId(account.id);
    if (users.length > 0) {
      const user = users[0];
      const updateDto: UpdateUserDto = {
        isStripeConnected: account.charges_enabled && account.payouts_enabled,
      };
      await this.usersService.update(user.id, updateDto);

      await this.cacheService.del(`stripe:status:${user.id}`);
    }
  }

  private async handlePayoutPaid(payout: Stripe.Payout): Promise<void> {
    const existingPayout = await this.payoutRepository.findOne({
      where: { stripePayoutId: payout.id },
    });

    if (existingPayout) {
      existingPayout.status = PayoutStatus.PAID;
      existingPayout.arrivalDate = new Date(payout.arrival_date * 1000);
      await this.payoutRepository.save(existingPayout);
    }
  }

  private async handlePayoutFailed(payout: Stripe.Payout): Promise<void> {
    const existingPayout = await this.payoutRepository.findOne({
      where: { stripePayoutId: payout.id },
    });

    if (existingPayout) {
      existingPayout.status = PayoutStatus.FAILED;
      existingPayout.failureReason = payout.failure_code || 'Неизвестная ошибка';
      await this.payoutRepository.save(existingPayout);
    }
  }

  // ==================== Возврат средств ====================

  async refundPayment(
    paymentId: string,
    userId: string,
    amount?: number,
    reason?: string,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Платеж не найден');
    }

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('Можно вернуть только успешный платеж');
    }

    if (!payment.stripePaymentIntentId) {
      throw new BadRequestException('Нет Stripe PaymentIntent для возврата');
    }

    const refundReason = reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer';

    const refund = await this.stripeService.createRefund(
      payment.stripePaymentIntentId,
      amount,
      refundReason,
    );

    payment.status = PaymentStatus.REFUNDED;
    payment.refundedAt = new Date();
    await this.paymentRepository.save(payment);

    await this.cacheService.del(`payment:${payment.id}`);

    return payment;
  }

  // ==================== Выплаты хозяевам ====================

  async requestPayout(userId: string, amount: number): Promise<Payout> {
    const user = await this.usersService.findById(userId);

    if (!user.stripeAccountId) {
      throw new BadRequestException('Stripe аккаунт не подключен');
    }

    const pendingPayout = await this.payoutRepository.findOne({
      where: { userId, status: PayoutStatus.PENDING },
    });
    if (pendingPayout) {
      throw new ConflictException('У вас уже есть заявка на вывод средств в обработке');
    }

    const account = await this.stripeService.getConnectedAccount(user.stripeAccountId);

    if (!account.payouts_enabled) {
      throw new BadRequestException('Выплаты не активированы');
    }

    const balance = await this.stripeService.getConnectedAccountBalance(user.stripeAccountId);
    const availableBalance = balance.available.find((b) => b.amount / 100 >= amount);

    if (!availableBalance) {
      throw new BadRequestException('Недостаточно средств для выплаты');
    }

    const payout = await this.stripeService.createPayout(
      user.stripeAccountId,
      amount,
      availableBalance.currency,
    );

    const payoutRecord = this.payoutRepository.create({
      userId,
      stripePayoutId: payout.id,
      amount: payout.amount / 100,
      currency: payout.currency.toUpperCase(),
      status: PayoutStatus.PENDING,
      type: payout.type,
      arrivalDate: new Date(payout.arrival_date * 1000),
    });

    await this.payoutRepository.save(payoutRecord);

    return payoutRecord;
  }

  async getPayoutHistory(userId: string, page = 1, limit = 10): Promise<{ payouts: Payout[]; total: number }> {
    const [payouts, total] = await this.payoutRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { payouts, total };
  }

  // ==================== История платежей ====================

  async getPaymentHistory(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ payments: Payment[]; total: number }> {
    const [payments, total] = await this.paymentRepository.findAndCount({
      where: { payerId: userId },
      relations: { booking: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { payments, total };
  }

  // ==================== Админские функции ====================

  async getWebhookEvents(
    page = 1,
    limit = 20,
    eventType?: string,
  ): Promise<{ events: StripeEvent[]; total: number }> {
    const where = eventType ? { eventType } : {};

    const [events, total] = await this.stripeEventRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { events, total };
  }

  async getFailedWebhookEvents(): Promise<StripeEvent[]> {
    return this.stripeEventRepository.find({
      where: { status: StripeEventStatus.FAILED },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async retryWebhookEvent(eventId: string): Promise<void> {
    const event = await this.stripeEventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Событие не найдено');
    }

    if (event.status !== StripeEventStatus.FAILED) {
      throw new BadRequestException('Можно повторить только неудачное событие');
    }

    event.status = StripeEventStatus.RECEIVED;
    event.retryCount += 1;
    await this.stripeEventRepository.save(event);
  }
}
