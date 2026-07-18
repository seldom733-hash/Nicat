import type { Job } from 'bull';
export declare class EmailProcessor {
    private readonly logger;
    handleWelcomeEmail(job: Job<{
        email: string;
        firstName: string;
    }>): Promise<{
        success: boolean;
    }>;
    handleBookingConfirmation(job: Job<{
        email: string;
        bookingReference: string;
        tourTitle: string;
        tourDate: string;
        totalPrice: number;
    }>): Promise<{
        success: boolean;
    }>;
    handlePaymentReceipt(job: Job<{
        email: string;
        paymentId: string;
        amount: number;
        currency: string;
    }>): Promise<{
        success: boolean;
    }>;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job, error: Error): void;
}
