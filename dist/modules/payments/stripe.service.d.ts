import { OnModuleInit } from '@nestjs/common';
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
export declare class StripeService implements OnModuleInit {
    private readonly configService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private ensureStripe;
    createConnectedAccount(email: string, country?: string, metadata?: Record<string, string>): Promise<Stripe.Account>;
    createAccountLink(accountId: string, refreshUrl?: string, returnUrl?: string): Promise<Stripe.AccountLink>;
    getConnectedAccount(accountId: string): Promise<Stripe.Account>;
    getConnectedAccountBalance(accountId: string): Promise<Stripe.Balance>;
    updateConnectedAccount(accountId: string, updates: Stripe.AccountUpdateParams): Promise<Stripe.Account>;
    createLoginLink(accountId: string): Promise<Stripe.LoginLink>;
    createPaymentIntent(amount: number, currency: string, connectedAccountId: string, bookingId: string, platformFeeAmount: number, metadata?: Record<string, string>): Promise<Stripe.PaymentIntent>;
    retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<Stripe.PaymentIntent>;
    cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    capturePaymentIntent(paymentIntentId: string, amountToCapture?: number): Promise<Stripe.PaymentIntent>;
    createCheckoutSession(amount: number, currency: string, connectedAccountId: string, bookingId: string, platformFeeAmount: number, successUrl: string, cancelUrl: string, customerEmail?: string): Promise<Stripe.Checkout.Session>;
    retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;
    createRefund(paymentIntentId: string, amount?: number, reason?: Stripe.RefundCreateParams.Reason): Promise<Stripe.Refund>;
    retrieveRefund(refundId: string): Promise<Stripe.Refund>;
    listRefunds(paymentIntentId: string, limit?: number): Promise<Stripe.ApiList<Stripe.Refund>>;
    createPayout(connectedAccountId: string, amount: number, currency?: string): Promise<Stripe.Payout>;
    listPayouts(connectedAccountId: string, limit?: number, status?: string): Promise<Stripe.ApiList<Stripe.Payout>>;
    retrievePayout(connectedAccountId: string, payoutId: string): Promise<Stripe.Payout>;
    createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer>;
    retrieveCustomer(customerId: string): Promise<Stripe.Customer>;
    updateCustomer(customerId: string, updates: Stripe.CustomerUpdateParams): Promise<Stripe.Customer>;
    retrieveCharge(chargeId: string): Promise<Stripe.Charge>;
    listCharges(paymentIntentId?: string, limit?: number): Promise<Stripe.ApiList<Stripe.Charge>>;
    createTransfer(connectedAccountId: string, amount: number, currency?: string, sourceTransaction?: string): Promise<Stripe.Transfer>;
    listTransfers(connectedAccountId?: string, limit?: number): Promise<Stripe.ApiList<Stripe.Transfer>>;
    constructWebhookEvent(payload: Buffer, signature: string): Promise<Stripe.Event>;
    getEvent(eventId: string): Promise<Stripe.Event>;
    getBalance(): Promise<Stripe.Balance>;
    getBalanceTransaction(balanceTransactionId: string): Promise<Stripe.BalanceTransaction>;
    formatAmountForStripe(amount: number): number;
    formatAmountFromStripe(amount: number): number;
    verifyWebhookSignature(payload: Buffer | string, signature: string, secret: string): Promise<boolean>;
}
