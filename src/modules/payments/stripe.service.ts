import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface StripeAccountResult {
  accountId: string;
  onboardingUrl: string;
}

export interface StripePaymentResult {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface StripeCheckoutResult {
  sessionId: string;
  url: string;
}

export interface StripeRefundResult {
  refundId: string;
  amount: number;
  status: string;
}

export interface StripePayoutResult {
  payoutId: string;
  amount: number;
  status: string;
  arrivalDate: Date;
}

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY не настроен — Stripe-функции недоступны');
      return;
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-06-30.basil' as any,
    });

    this.logger.log('Stripe SDK инициализирован');
  }

  private ensureStripe(): void {
    if (!this.stripe) {
      throw new BadRequestException('Stripe не настроен. Установите STRIPE_SECRET_KEY.');
    }
  }

  // ==================== Connected Accounts ====================

  async createConnectedAccount(
    email: string,
    country: string = 'US',
    metadata?: Record<string, string>,
  ): Promise<Stripe.Account> {
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
    } catch (error) {
      this.logger.error('Ошибка создания connected account', error);
      throw error;
    }
  }

  async createAccountLink(
    accountId: string,
    refreshUrl?: string,
    returnUrl?: string,
  ): Promise<Stripe.AccountLink> {
    this.ensureStripe();

    try {
      const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');

      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl || `${appUrl}/stripe/reauth`,
        return_url: returnUrl || `${appUrl}/stripe/complete`,
        type: 'account_onboarding',
      });

      this.logger.log(`Создан account link для: ${accountId}`);
      return accountLink;
    } catch (error) {
      this.logger.error('Ошибка создания account link', error);
      throw error;
    }
  }

  async getConnectedAccount(accountId: string): Promise<Stripe.Account> {
    this.ensureStripe();
    return this.stripe.accounts.retrieve(accountId);
  }

  async getConnectedAccountBalance(accountId: string): Promise<Stripe.Balance> {
    this.ensureStripe();
    return this.stripe.balance.retrieve({}, { stripeAccount: accountId } as any);
  }

  async updateConnectedAccount(
    accountId: string,
    updates: Stripe.AccountUpdateParams,
  ): Promise<Stripe.Account> {
    this.ensureStripe();
    return this.stripe.accounts.update(accountId, updates);
  }

  async createLoginLink(accountId: string): Promise<Stripe.LoginLink> {
    this.ensureStripe();
    return this.stripe.accounts.createLoginLink(accountId);
  }

  // ==================== Payment Intents ====================

  async createPaymentIntent(
    amount: number,
    currency: string,
    connectedAccountId: string,
    bookingId: string,
    platformFeeAmount: number,
    metadata?: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
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
    } catch (error) {
      this.logger.error('Ошибка создания payment intent', error);
      throw error;
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    this.ensureStripe();
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string,
  ): Promise<Stripe.PaymentIntent> {
    this.ensureStripe();

    const params: Stripe.PaymentIntentConfirmParams = {};
    if (paymentMethodId) {
      params.payment_method = paymentMethodId;
    }

    return this.stripe.paymentIntents.confirm(paymentIntentId, params);
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    this.ensureStripe();
    return this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  async capturePaymentIntent(
    paymentIntentId: string,
    amountToCapture?: number,
  ): Promise<Stripe.PaymentIntent> {
    this.ensureStripe();

    const params: Stripe.PaymentIntentCaptureParams = {};
    if (amountToCapture) {
      params.amount_to_capture = Math.round(amountToCapture * 100);
    }

    return this.stripe.paymentIntents.capture(paymentIntentId, params);
  }

  // ==================== Checkout Sessions ====================

  async createCheckoutSession(
    amount: number,
    currency: string,
    connectedAccountId: string,
    bookingId: string,
    platformFeeAmount: number,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
  ): Promise<Stripe.Checkout.Session> {
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
    } catch (error) {
      this.logger.error('Ошибка создания checkout session', error);
      throw error;
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    this.ensureStripe();
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  // ==================== Refunds ====================

  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: Stripe.RefundCreateParams.Reason,
  ): Promise<Stripe.Refund> {
    this.ensureStripe();

    try {
      const refundParams: Stripe.RefundCreateParams = {
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
    } catch (error) {
      this.logger.error('Ошибка создания refund', error);
      throw error;
    }
  }

  async retrieveRefund(refundId: string): Promise<Stripe.Refund> {
    this.ensureStripe();
    return this.stripe.refunds.retrieve(refundId);
  }

  async listRefunds(
    paymentIntentId: string,
    limit?: number,
  ): Promise<Stripe.ApiList<Stripe.Refund>> {
    this.ensureStripe();
    return this.stripe.refunds.list({
      payment_intent: paymentIntentId,
      limit: limit || 10,
    });
  }

  // ==================== Payouts ====================

  async createPayout(
    connectedAccountId: string,
    amount: number,
    currency: string = 'usd',
  ): Promise<Stripe.Payout> {
    this.ensureStripe();

    try {
      const payout = await this.stripe.payouts.create(
        {
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
        },
        { stripeAccount: connectedAccountId },
      );

      this.logger.log(`Создан payout: ${payout.id} на сумму ${amount} ${currency}`);
      return payout;
    } catch (error) {
      this.logger.error('Ошибка создания payout', error);
      throw error;
    }
  }

  async listPayouts(
    connectedAccountId: string,
    limit?: number,
    status?: string,
  ): Promise<Stripe.ApiList<Stripe.Payout>> {
    this.ensureStripe();

    const params: any = {
      limit: limit || 10,
    };

    if (status) {
      params.status = status;
    }

    return this.stripe.payouts.list(params, { stripeAccount: connectedAccountId } as any);
  }

  async retrievePayout(
    connectedAccountId: string,
    payoutId: string,
  ): Promise<Stripe.Payout> {
    this.ensureStripe();
    return this.stripe.payouts.retrieve(payoutId, {
      stripeAccount: connectedAccountId,
    } as any);
  }

  // ==================== Customers ====================

  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Customer> {
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

  async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    this.ensureStripe();
    return this.stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
  }

  async updateCustomer(
    customerId: string,
    updates: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    this.ensureStripe();
    return this.stripe.customers.update(customerId, updates);
  }

  // ==================== Charges ====================

  async retrieveCharge(chargeId: string): Promise<Stripe.Charge> {
    this.ensureStripe();
    return this.stripe.charges.retrieve(chargeId);
  }

  async listCharges(
    paymentIntentId?: string,
    limit?: number,
  ): Promise<Stripe.ApiList<Stripe.Charge>> {
    this.ensureStripe();

    const params: Stripe.ChargeListParams = {
      limit: limit || 10,
    };

    if (paymentIntentId) {
      params.payment_intent = paymentIntentId;
    }

    return this.stripe.charges.list(params);
  }

  // ==================== Transfers ====================

  async createTransfer(
    connectedAccountId: string,
    amount: number,
    currency: string = 'usd',
    sourceTransaction?: string,
  ): Promise<Stripe.Transfer> {
    this.ensureStripe();

    const params: Stripe.TransferCreateParams = {
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      destination: connectedAccountId,
    };

    if (sourceTransaction) {
      params.source_transaction = sourceTransaction;
    }

    return this.stripe.transfers.create(params);
  }

  async listTransfers(
    connectedAccountId?: string,
    limit?: number,
  ): Promise<Stripe.ApiList<Stripe.Transfer>> {
    this.ensureStripe();

    const params: Stripe.TransferListParams = {
      limit: limit || 10,
    };

    if (connectedAccountId) {
      params.destination = connectedAccountId;
    }

    return this.stripe.transfers.list(params);
  }

  // ==================== Events & Webhooks ====================

  async constructWebhookEvent(payload: Buffer, signature: string): Promise<Stripe.Event> {
    this.ensureStripe();

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET не настроен');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async getEvent(eventId: string): Promise<Stripe.Event> {
    this.ensureStripe();
    return this.stripe.events.retrieve(eventId);
  }

  // ==================== Balance & Reports ====================

  async getBalance(): Promise<Stripe.Balance> {
    this.ensureStripe();
    return this.stripe.balance.retrieve();
  }

  async getBalanceTransaction(
    balanceTransactionId: string,
  ): Promise<Stripe.BalanceTransaction> {
    this.ensureStripe();
    return this.stripe.balanceTransactions.retrieve(balanceTransactionId);
  }

  // ==================== Helpers ====================

  formatAmountForStripe(amount: number): number {
    return Math.round(amount * 100);
  }

  formatAmountFromStripe(amount: number): number {
    return amount / 100;
  }

  async verifyWebhookSignature(
    payload: Buffer | string,
    signature: string,
    secret: string,
  ): Promise<boolean> {
    try {
      this.stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch {
      return false;
    }
  }
}
