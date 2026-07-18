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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = StripeService_1 = class StripeService {
    configService;
    stripe;
    logger = new common_1.Logger(StripeService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!secretKey) {
            this.logger.warn('STRIPE_SECRET_KEY не настроен — Stripe-функции недоступны');
            return;
        }
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-06-30.basil',
        });
        this.logger.log('Stripe SDK инициализирован');
    }
    ensureStripe() {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe не настроен. Установите STRIPE_SECRET_KEY.');
        }
    }
    async createConnectedAccount(email, country = 'US', metadata) {
        this.ensureStripe();
        try {
            const account = await this.stripe.accounts.create({
                type: 'express',
                email,
                country,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                metadata: {
                    platform: 'nicat',
                    ...metadata,
                },
            });
            this.logger.log(`Создан connected account: ${account.id} для ${email}`);
            return account;
        }
        catch (error) {
            this.logger.error('Ошибка создания connected account', error);
            throw error;
        }
    }
    async createAccountLink(accountId, refreshUrl, returnUrl) {
        this.ensureStripe();
        try {
            const appUrl = this.configService.get('APP_URL', 'http://localhost:3000');
            const accountLink = await this.stripe.accountLinks.create({
                account: accountId,
                refresh_url: refreshUrl || `${appUrl}/stripe/reauth`,
                return_url: returnUrl || `${appUrl}/stripe/complete`,
                type: 'account_onboarding',
            });
            this.logger.log(`Создан account link для: ${accountId}`);
            return accountLink;
        }
        catch (error) {
            this.logger.error('Ошибка создания account link', error);
            throw error;
        }
    }
    async getConnectedAccount(accountId) {
        this.ensureStripe();
        return this.stripe.accounts.retrieve(accountId);
    }
    async getConnectedAccountBalance(accountId) {
        this.ensureStripe();
        return this.stripe.balance.retrieve({}, { stripeAccount: accountId });
    }
    async updateConnectedAccount(accountId, updates) {
        this.ensureStripe();
        return this.stripe.accounts.update(accountId, updates);
    }
    async createLoginLink(accountId) {
        this.ensureStripe();
        return this.stripe.accounts.createLoginLink(accountId);
    }
    async createPaymentIntent(amount, currency, connectedAccountId, bookingId, platformFeeAmount, metadata) {
        this.ensureStripe();
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: currency.toLowerCase(),
                application_fee_amount: Math.round(platformFeeAmount * 100),
                transfer_data: {
                    destination: connectedAccountId,
                },
                metadata: {
                    bookingId,
                    platform: 'nicat',
                    ...metadata,
                },
            });
            this.logger.log(`Создан payment intent: ${paymentIntent.id} на сумму ${amount} ${currency}`);
            return paymentIntent;
        }
        catch (error) {
            this.logger.error('Ошибка создания payment intent', error);
            throw error;
        }
    }
    async retrievePaymentIntent(paymentIntentId) {
        this.ensureStripe();
        return this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
    async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
        this.ensureStripe();
        const params = {};
        if (paymentMethodId) {
            params.payment_method = paymentMethodId;
        }
        return this.stripe.paymentIntents.confirm(paymentIntentId, params);
    }
    async cancelPaymentIntent(paymentIntentId) {
        this.ensureStripe();
        return this.stripe.paymentIntents.cancel(paymentIntentId);
    }
    async capturePaymentIntent(paymentIntentId, amountToCapture) {
        this.ensureStripe();
        const params = {};
        if (amountToCapture) {
            params.amount_to_capture = Math.round(amountToCapture * 100);
        }
        return this.stripe.paymentIntents.capture(paymentIntentId, params);
    }
    async createCheckoutSession(amount, currency, connectedAccountId, bookingId, platformFeeAmount, successUrl, cancelUrl, customerEmail) {
        this.ensureStripe();
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: customerEmail,
                line_items: [
                    {
                        price_data: {
                            currency: currency.toLowerCase(),
                            product_data: {
                                name: `Nicat Tour Booking #${bookingId}`,
                                description: 'Бронирование тура на платформе Nicat',
                            },
                            unit_amount: Math.round(amount * 100),
                        },
                        quantity: 1,
                    },
                ],
                payment_intent_data: {
                    application_fee_amount: Math.round(platformFeeAmount * 100),
                    transfer_data: {
                        destination: connectedAccountId,
                    },
                    metadata: {
                        bookingId,
                        platform: 'nicat',
                    },
                },
                success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: cancelUrl,
                metadata: {
                    bookingId,
                    platform: 'nicat',
                },
            });
            this.logger.log(`Создан checkout session: ${session.id}`);
            return session;
        }
        catch (error) {
            this.logger.error('Ошибка создания checkout session', error);
            throw error;
        }
    }
    async retrieveCheckoutSession(sessionId) {
        this.ensureStripe();
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
    async createRefund(paymentIntentId, amount, reason) {
        this.ensureStripe();
        try {
            const refundParams = {
                payment_intent: paymentIntentId,
            };
            if (amount) {
                refundParams.amount = Math.round(amount * 100);
            }
            if (reason) {
                refundParams.reason = reason;
            }
            const refund = await this.stripe.refunds.create(refundParams);
            this.logger.log(`Создан refund: ${refund.id} для ${paymentIntentId}`);
            return refund;
        }
        catch (error) {
            this.logger.error('Ошибка создания refund', error);
            throw error;
        }
    }
    async retrieveRefund(refundId) {
        this.ensureStripe();
        return this.stripe.refunds.retrieve(refundId);
    }
    async listRefunds(paymentIntentId, limit) {
        this.ensureStripe();
        return this.stripe.refunds.list({
            payment_intent: paymentIntentId,
            limit: limit || 10,
        });
    }
    async createPayout(connectedAccountId, amount, currency = 'usd') {
        this.ensureStripe();
        try {
            const payout = await this.stripe.payouts.create({
                amount: Math.round(amount * 100),
                currency: currency.toLowerCase(),
            }, { stripeAccount: connectedAccountId });
            this.logger.log(`Создан payout: ${payout.id} на сумму ${amount} ${currency}`);
            return payout;
        }
        catch (error) {
            this.logger.error('Ошибка создания payout', error);
            throw error;
        }
    }
    async listPayouts(connectedAccountId, limit, status) {
        this.ensureStripe();
        const params = {
            limit: limit || 10,
        };
        if (status) {
            params.status = status;
        }
        return this.stripe.payouts.list(params, { stripeAccount: connectedAccountId });
    }
    async retrievePayout(connectedAccountId, payoutId) {
        this.ensureStripe();
        return this.stripe.payouts.retrieve(payoutId, {
            stripeAccount: connectedAccountId,
        });
    }
    async createCustomer(email, name, metadata) {
        this.ensureStripe();
        return this.stripe.customers.create({
            email,
            name,
            metadata: {
                platform: 'nicat',
                ...metadata,
            },
        });
    }
    async retrieveCustomer(customerId) {
        this.ensureStripe();
        return this.stripe.customers.retrieve(customerId);
    }
    async updateCustomer(customerId, updates) {
        this.ensureStripe();
        return this.stripe.customers.update(customerId, updates);
    }
    async retrieveCharge(chargeId) {
        this.ensureStripe();
        return this.stripe.charges.retrieve(chargeId);
    }
    async listCharges(paymentIntentId, limit) {
        this.ensureStripe();
        const params = {
            limit: limit || 10,
        };
        if (paymentIntentId) {
            params.payment_intent = paymentIntentId;
        }
        return this.stripe.charges.list(params);
    }
    async createTransfer(connectedAccountId, amount, currency = 'usd', sourceTransaction) {
        this.ensureStripe();
        const params = {
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            destination: connectedAccountId,
        };
        if (sourceTransaction) {
            params.source_transaction = sourceTransaction;
        }
        return this.stripe.transfers.create(params);
    }
    async listTransfers(connectedAccountId, limit) {
        this.ensureStripe();
        const params = {
            limit: limit || 10,
        };
        if (connectedAccountId) {
            params.destination = connectedAccountId;
        }
        return this.stripe.transfers.list(params);
    }
    async constructWebhookEvent(payload, signature) {
        this.ensureStripe();
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
            throw new common_1.BadRequestException('STRIPE_WEBHOOK_SECRET не настроен');
        }
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
    async getEvent(eventId) {
        this.ensureStripe();
        return this.stripe.events.retrieve(eventId);
    }
    async getBalance() {
        this.ensureStripe();
        return this.stripe.balance.retrieve();
    }
    async getBalanceTransaction(balanceTransactionId) {
        this.ensureStripe();
        return this.stripe.balanceTransactions.retrieve(balanceTransactionId);
    }
    formatAmountForStripe(amount) {
        return Math.round(amount * 100);
    }
    formatAmountFromStripe(amount) {
        return amount / 100;
    }
    async verifyWebhookSignature(payload, signature, secret) {
        try {
            this.stripe.webhooks.constructEvent(payload, signature, secret);
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map