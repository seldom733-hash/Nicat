export declare enum StripeEventStatus {
    RECEIVED = "received",
    PROCESSING = "processing",
    PROCESSED = "processed",
    FAILED = "failed",
    IGNORED = "ignored"
}
export declare class StripeEvent {
    id: string;
    stripeEventId: string;
    eventType: string;
    status: StripeEventStatus;
    payload: any;
    metadata: Record<string, any>;
    errorMessage: string;
    retryCount: number;
    processedAt: Date;
    createdAt: Date;
}
