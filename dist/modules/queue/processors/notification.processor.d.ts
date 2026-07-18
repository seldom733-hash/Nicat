import type { Job } from 'bull';
export declare class NotificationProcessor {
    private readonly logger;
    handlePushNotification(job: Job<{
        userId: string;
        title: string;
        body: string;
        data?: any;
    }>): Promise<{
        success: boolean;
    }>;
    handleInAppNotification(job: Job<{
        userId: string;
        type: string;
        title: string;
        message: string;
        metadata?: any;
    }>): Promise<{
        success: boolean;
    }>;
    onCompleted(job: Job, result: any): void;
    onFailed(job: Job, error: Error): void;
}
