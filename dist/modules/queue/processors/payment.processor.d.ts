import type { Job } from 'bull';
export declare class PaymentProcessor {
    private readonly logger;
    handleProcessPayment(job: Job<{
        bookingId: string;
        userId: string;
        amount: number;
        currency: string;
    }>): Promise<{
        success: boolean;
    }>;
    handleWebhook(job: Job<{
        eventType: string;
        payload: any;
    }>): Promise<{
        success: boolean;
    }>;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job, error: Error): void;
}
