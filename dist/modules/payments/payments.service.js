"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const stripe_event_entity_1 = require("./entities/stripe-event.entity");
const payout_entity_1 = require("./entities/payout.entity");
const stripe_service_1 = require("./stripe.service");
const bookings_service_1 = require("../bookings/bookings.service");
const tours_service_1 = require("../tours/tours.service");
const users_service_1 = require("../users/users.service");
const pricing_engine_1 = require("./pricing.engine");
const cache_service_1 = require("../../core/cache/cache.service");
const constants_1 = require("../../common/constants");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentRepository;
    stripeEventRepository;
    payoutRepository;
    stripeService;
    bookingsService;
    toursService;
    usersService;
    pricingEngine;
    cacheService;
    dataSource;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentRepository, stripeEventRepository, payoutRepository, stripeService, bookingsService, toursService, usersService, pricingEngine, cacheService, dataSource) {
        this.paymentRepository = paymentRepository;
        this.stripeEventRepository = stripeEventRepository;
        this.payoutRepository = payoutRepository;
        this.stripeService = stripeService;
        this.bookingsService = bookingsService;
        this.toursService = toursService;
        this.usersService = usersService;
        this.pricingEngine = pricingEngine;
        this.cacheService = cacheService;
        this.dataSource = dataSource;
    }
    async getPaymentById(paymentId) {
        const cacheKey = `payment:${paymentId}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: { booking: true, payer: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Платеж не найден');
        }
        await this.cacheService.set(cacheKey, payment, 300);
        return payment;
    }
    async getPaymentByBookingId(bookingId) {
        const cacheKey = `payment:booking:${bookingId}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        const payment = await this.paymentRepository.findOne({
            where: { bookingId },
            order: { createdAt: 'DESC' },
        });
        if (payment) {
            await this.cacheService.set(cacheKey, payment, 300);
        }
        return payment;
    }
    async getStripeConnectStatus(userId) {
        const cacheKey = `stripe:status:${userId}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
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
        }
        catch {
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
    async initiatePayment(bookingId, userId, useCheckoutSession = false, successUrl, cancelUrl) {
        const booking = await this.bookingsService.findById(bookingId);
        if (booking.userId !== userId) {
            throw new common_1.BadRequestException('Нет доступа к этому бронированию');
        }
        if (booking.status !== constants_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Бронирование не в статусе ожидания');
        }
        const tour = await this.toursService.findById(booking.tourId);
        const host = await this.usersService.findById(tour.hostId);
        if (!host.stripeAccountId) {
            throw new common_1.BadRequestException('Хозяин тура не подключил Stripe');
        }
        const pricing = this.pricingEngine.calculateTotalPrice(tour.basePrice, booking.numberOfPassengers, tour.commissionRate);
        if (useCheckoutSession) {
            return this.createCheckoutSessionPayment(booking, pricing, host.stripeAccountId, successUrl, cancelUrl);
        }
        return this.createDirectPayment(booking, pricing, host.stripeAccountId);
    }
    async createDirectPayment(booking, pricing, connectedAccountId) {
        const paymentIntent = await this.stripeService.createPaymentIntent(pricing.totalPrice, booking.currency, connectedAccountId, booking.id, pricing.platformCommission, {
            bookingReference: booking.bookingReference,
            tourId: booking.tourId,
            numberOfPassengers: booking.numberOfPassengers.toString(),
        });
        const payment = this.paymentRepository.create({
            bookingId: booking.id,
            payerId: booking.userId,
            amount: pricing.totalPrice,
            currency: booking.currency,
            status: constants_1.PaymentStatus.PENDING,
            stripePaymentIntentId: paymentIntent.id,
        });
        await this.paymentRepository.save(payment);
        const updateDto = { status: constants_1.BookingStatus.PENDING };
        await this.bookingsService.updateStatus(booking.id, updateDto, booking.userId);
        this.logger.log(`Платеж инициирован: ${paymentIntent.id} для бронирования ${booking.bookingReference}`);
        return {
            clientSecret: paymentIntent.client_secret || '',
            paymentIntentId: paymentIntent.id,
        };
    }
    async createCheckoutSessionPayment(booking, pricing, connectedAccountId, successUrl, cancelUrl) {
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        const session = await this.stripeService.createCheckoutSession(pricing.totalPrice, booking.currency, connectedAccountId, booking.id, pricing.platformCommission, successUrl || `${appUrl}/booking/success`, cancelUrl || `${appUrl}/booking/cancel`, undefined);
        const payment = this.paymentRepository.create({
            bookingId: booking.id,
            payerId: booking.userId,
            amount: pricing.totalPrice,
            currency: booking.currency,
            status: constants_1.PaymentStatus.PENDING,
            stripePaymentIntentId: session.payment_intent,
            paymentMethod: `checkout_session:${session.id}`,
        });
        await this.paymentRepository.save(payment);
        this.logger.log(`Checkout session создан: ${session.id} для бронирования ${booking.bookingReference}`);
        return {
            checkoutSessionId: session.id,
            checkoutUrl: session.url || '',
        };
    }
    async handleWebhook(event) {
        const existingEvent = await this.stripeEventRepository.findOne({
            where: { stripeEventId: event.id },
        });
        if (existingEvent) {
            if (existingEvent.status === stripe_event_entity_1.StripeEventStatus.PROCESSED) {
                return;
            }
            if (existingEvent.status === stripe_event_entity_1.StripeEventStatus.PROCESSING) {
                return;
            }
        }
        const stripeEvent = this.stripeEventRepository.create({
            stripeEventId: event.id,
            eventType: event.type,
            status: stripe_event_entity_1.StripeEventStatus.PROCESSING,
            payload: event.data.object,
            metadata: {
                apiVersion: event.api_version,
                created: event.created,
            },
        });
        await this.stripeEventRepository.save(stripeEvent);
        try {
            await this.processWebhookEvent(event);
            stripeEvent.status = stripe_event_entity_1.StripeEventStatus.PROCESSED;
            stripeEvent.processedAt = new Date();
            await this.stripeEventRepository.save(stripeEvent);
        }
        catch (error) {
            stripeEvent.status = stripe_event_entity_1.StripeEventStatus.FAILED;
            stripeEvent.errorMessage = error.message;
            stripeEvent.retryCount += 1;
            await this.stripeEventRepository.save(stripeEvent);
            this.logger.error(`Ошибка обработки webhook ${event.type}: ${error.message}`);
            throw error;
        }
    }
    async processWebhookEvent(event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(event.data.object);
                break;
            case 'payment_intent.canceled':
                await this.handlePaymentCanceled(event.data.object);
                break;
            case 'charge.succeeded':
                await this.handleChargeSucceeded(event.data.object);
                break;
            case 'charge.refunded':
                await this.handleChargeRefunded(event.data.object);
                break;
            case 'charge.dispute.created':
                await this.handleDisputeCreated(event.data.object);
                break;
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'checkout.session.expired':
                await this.handleCheckoutExpired(event.data.object);
                break;
            case 'account.updated':
                await this.handleAccountUpdated(event.data.object);
                break;
            case 'payout.paid':
                await this.handlePayoutPaid(event.data.object);
                break;
            case 'payout.failed':
                await this.handlePayoutFailed(event.data.object);
                break;
            default:
                this.logger.log(`Необработанное событие Stripe: ${event.type}`);
        }
    }
    async handlePaymentSuccess(paymentIntent) {
        const payment = await this.paymentRepository.findOne({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            payment.status = constants_1.PaymentStatus.SUCCEEDED;
            payment.paidAt = new Date();
            payment.stripeChargeId = paymentIntent.latest_charge;
            await this.paymentRepository.save(payment);
            const updateDto = { status: constants_1.BookingStatus.PAID };
            await this.bookingsService.updateStatus(payment.bookingId, updateDto, payment.payerId);
            await this.cacheService.del(`payment:${payment.id}`);
            await this.cacheService.del(`payment:booking:${payment.bookingId}`);
        }
    }
    async handlePaymentFailure(paymentIntent) {
        const payment = await this.paymentRepository.findOne({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            payment.status = constants_1.PaymentStatus.FAILED;
            payment.failureReason = paymentIntent.last_payment_error?.message || 'Неизвестная ошибка';
            await this.paymentRepository.save(payment);
        }
    }
    async handlePaymentCanceled(paymentIntent) {
        const payment = await this.paymentRepository.findOne({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            payment.status = constants_1.PaymentStatus.FAILED;
            payment.failureReason = 'Платеж отменен';
            await this.paymentRepository.save(payment);
        }
    }
    async handleChargeSucceeded(charge) {
        const payment = await this.paymentRepository.findOne({
            where: { stripePaymentIntentId: charge.payment_intent },
        });
        if (payment && !payment.stripeChargeId) {
            payment.stripeChargeId = charge.id;
            await this.paymentRepository.save(payment);
        }
    }
    async handleChargeRefunded(charge) {
        const payment = await this.paymentRepository.findOne({
            where: { stripeChargeId: charge.id },
        });
        if (payment) {
            payment.status = constants_1.PaymentStatus.REFUNDED;
            payment.refundedAt = new Date();
            await this.paymentRepository.save(payment);
            const updateDto = { status: constants_1.BookingStatus.REFUNDED };
            await this.bookingsService.updateStatus(payment.bookingId, updateDto, payment.payerId);
            await this.cacheService.del(`payment:${payment.id}`);
        }
    }
    async handleDisputeCreated(dispute) {
        this.logger.warn(`Создан спор: ${dispute.id} на сумму ${dispute.amount / 100} ${dispute.currency}`);
    }
    async handleCheckoutCompleted(session) {
        const payment = await this.paymentRepository.findOne({
            where: { paymentMethod: `checkout_session:${session.id}` },
        });
        if (payment) {
            payment.status = constants_1.PaymentStatus.SUCCEEDED;
            payment.paidAt = new Date();
            payment.stripePaymentIntentId = session.payment_intent;
            payment.stripeChargeId = session.payment_intent;
            await this.paymentRepository.save(payment);
            const updateDto = { status: constants_1.BookingStatus.PAID };
            await this.bookingsService.updateStatus(payment.bookingId, updateDto, payment.payerId);
            await this.cacheService.del(`payment:${payment.id}`);
        }
    }
    async handleCheckoutExpired(session) {
        const payment = await this.paymentRepository.findOne({
            where: { paymentMethod: `checkout_session:${session.id}` },
        });
        if (payment) {
            payment.status = constants_1.PaymentStatus.FAILED;
            payment.failureReason = 'Checkout session истек';
            await this.paymentRepository.save(payment);
        }
    }
    async handleAccountUpdated(account) {
        const users = await this.usersService.findByStripeAccountId(account.id);
        if (users.length > 0) {
            const user = users[0];
            const updateDto = {
                isStripeConnected: account.charges_enabled && account.payouts_enabled,
            };
            await this.usersService.update(user.id, updateDto);
            await this.cacheService.del(`stripe:status:${user.id}`);
        }
    }
    async handlePayoutPaid(payout) {
        const existingPayout = await this.payoutRepository.findOne({
            where: { stripePayoutId: payout.id },
        });
        if (existingPayout) {
            existingPayout.status = payout_entity_1.PayoutStatus.PAID;
            existingPayout.arrivalDate = new Date(payout.arrival_date * 1000);
            await this.payoutRepository.save(existingPayout);
        }
    }
    async handlePayoutFailed(payout) {
        const existingPayout = await this.payoutRepository.findOne({
            where: { stripePayoutId: payout.id },
        });
        if (existingPayout) {
            existingPayout.status = payout_entity_1.PayoutStatus.FAILED;
            existingPayout.failureReason = payout.failure_code || 'Неизвестная ошибка';
            await this.payoutRepository.save(existingPayout);
        }
    }
    async refundPayment(paymentId, userId, amount, reason) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Платеж не найден');
        }
        if (payment.status !== constants_1.PaymentStatus.SUCCEEDED) {
            throw new common_1.BadRequestException('Можно вернуть только успешный платеж');
        }
        if (!payment.stripePaymentIntentId) {
            throw new common_1.BadRequestException('Нет Stripe PaymentIntent для возврата');
        }
        const refundReason = reason || 'requested_by_customer';
        const refund = await this.stripeService.createRefund(payment.stripePaymentIntentId, amount, refundReason);
        payment.status = constants_1.PaymentStatus.REFUNDED;
        payment.refundedAt = new Date();
        await this.paymentRepository.save(payment);
        await this.cacheService.del(`payment:${payment.id}`);
        return payment;
    }
    async requestPayout(userId, amount) {
        const user = await this.usersService.findById(userId);
        if (!user.stripeAccountId) {
            throw new common_1.BadRequestException('Stripe аккаунт не подключен');
        }
        const pendingPayout = await this.payoutRepository.findOne({
            where: { userId, status: payout_entity_1.PayoutStatus.PENDING },
        });
        if (pendingPayout) {
            throw new common_1.ConflictException('У вас уже есть заявка на вывод средств в обработке');
        }
        const account = await this.stripeService.getConnectedAccount(user.stripeAccountId);
        if (!account.payouts_enabled) {
            throw new common_1.BadRequestException('Выплаты не активированы');
        }
        const balance = await this.stripeService.getConnectedAccountBalance(user.stripeAccountId);
        const availableBalance = balance.available.find((b) => b.amount / 100 >= amount);
        if (!availableBalance) {
            throw new common_1.BadRequestException('Недостаточно средств для выплаты');
        }
        const payout = await this.stripeService.createPayout(user.stripeAccountId, amount, availableBalance.currency);
        const payoutRecord = this.payoutRepository.create({
            userId,
            stripePayoutId: payout.id,
            amount: payout.amount / 100,
            currency: payout.currency.toUpperCase(),
            status: payout_entity_1.PayoutStatus.PENDING,
            type: payout.type,
            arrivalDate: new Date(payout.arrival_date * 1000),
        });
        await this.payoutRepository.save(payoutRecord);
        return payoutRecord;
    }
    async getPayoutHistory(userId, page = 1, limit = 10) {
        const [payouts, total] = await this.payoutRepository.findAndCount({
            where: { userId },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { payouts, total };
    }
    async getPaymentHistory(userId, page = 1, limit = 10) {
        const [payments, total] = await this.paymentRepository.findAndCount({
            where: { payerId: userId },
            relations: { booking: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { payments, total };
    }
    async getWebhookEvents(page = 1, limit = 20, eventType) {
        const where = eventType ? { eventType } : {};
        const [events, total] = await this.stripeEventRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { events, total };
    }
    async getFailedWebhookEvents() {
        return this.stripeEventRepository.find({
            where: { status: stripe_event_entity_1.StripeEventStatus.FAILED },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async retryWebhookEvent(eventId) {
        const event = await this.stripeEventRepository.findOne({
            where: { id: eventId },
        });
        if (!event) {
            throw new common_1.NotFoundException('Событие не найдено');
        }
        if (event.status !== stripe_event_entity_1.StripeEventStatus.FAILED) {
            throw new common_1.BadRequestException('Можно повторить только неудачное событие');
        }
        event.status = stripe_event_entity_1.StripeEventStatus.RECEIVED;
        event.retryCount += 1;
        await this.stripeEventRepository.save(event);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(stripe_event_entity_1.StripeEvent)),
    __param(2, (0, typeorm_1.InjectRepository)(payout_entity_1.Payout)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_service_1.StripeService,
        bookings_service_1.BookingsService,
        tours_service_1.ToursService,
        users_service_1.UsersService,
        pricing_engine_1.PricingEngine,
        cache_service_1.CacheService,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map