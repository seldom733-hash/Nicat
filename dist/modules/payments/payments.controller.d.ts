import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { UsersService } from '../users/users.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { CreateConnectAccountDto } from './dto/create-connect-account.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly stripeService;
    private readonly usersService;
    private readonly logger;
    constructor(paymentsService: PaymentsService, stripeService: StripeService, usersService: UsersService);
    initiatePayment(dto: InitiatePaymentDto, req: any): Promise<{
        clientSecret?: string;
        paymentIntentId?: string;
        checkoutSessionId?: string;
        checkoutUrl?: string;
    }>;
    getPaymentHistory(req: any, page?: number, limit?: number): Promise<{
        payments: import("./entities").Payment[];
        total: number;
    }>;
    getPaymentByBookingId(bookingId: string): Promise<import("./entities").Payment | null>;
    getPaymentById(id: string): Promise<import("./entities").Payment>;
    refundPayment(dto: RefundPaymentDto, req: any): Promise<import("./entities").Payment>;
    createStripeConnect(dto: CreateConnectAccountDto, req: any): Promise<{
        accountId: string;
        onboardingUrl: string;
        isExisting: boolean;
    }>;
    getStripeConnectStatus(req: any): Promise<{
        isConnected: boolean;
        accountId?: string;
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
        detailsSubmitted: boolean;
    }>;
    getStripeDashboard(req: any): Promise<{
        url: null;
        message: string;
    } | {
        url: string;
        message?: undefined;
    }>;
    getStripeBalance(req: any): Promise<{
        available: {
            amount: number;
            currency: string;
        }[];
        pending: {
            amount: number;
            currency: string;
        }[];
    }>;
    requestPayout(amount: number, req: any): Promise<import("./entities/payout.entity").Payout>;
    getPayoutHistory(req: any, page?: number, limit?: number): Promise<{
        payouts: import("./entities/payout.entity").Payout[];
        total: number;
    }>;
    handleWebhook(req: any): Promise<{
        error: string;
        received?: undefined;
    } | {
        received: boolean;
        error?: undefined;
    }>;
    getWebhookEvents(page?: number, limit?: number, eventType?: string): Promise<{
        events: import("./entities/stripe-event.entity").StripeEvent[];
        total: number;
    }>;
    getFailedWebhookEvents(): Promise<import("./entities/stripe-event.entity").StripeEvent[]>;
    retryWebhookEvent(id: string): Promise<{
        message: string;
    }>;
}
