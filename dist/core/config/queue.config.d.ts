import { BullModuleOptions } from '@nestjs/bull';
export declare const getQueueConfig: (redisHost: string, redisPort: number, redisPassword?: string) => BullModuleOptions;
export declare enum QueueNames {
    EMAIL = "nicat-email",
    PAYMENT = "nicat-payment",
    NOTIFICATION = "nicat-notification",
    SEARCH_INDEX = "nicat-search-index",
    ANALYTICS = "nicat-analytics",
    FILE_UPLOAD = "nicat-file-upload"
}
export declare enum JobNames {
    SEND_WELCOME_EMAIL = "send-welcome-email",
    SEND_BOOKING_CONFIRMATION = "send-booking-confirmation",
    SEND_PAYMENT_RECEIPT = "send-payment-receipt",
    SEND_CANCELLATION_NOTICE = "send-cancellation-notice",
    PROCESS_PAYMENT = "process-payment",
    HANDLE_WEBHOOK = "handle-stripe-webhook",
    PROCESS_REFUND = "process-refund",
    GENERATE_INVOICE = "generate-invoice",
    SEND_PUSH_NOTIFICATION = "send-push-notification",
    SEND_IN_APP_NOTIFICATION = "send-in-app-notification",
    INDEX_TOUR = "index-tour",
    REINDEX_ALL = "reindex-all",
    GENERATE_REPORT = "generate-report",
    AGGREGATE_STATS = "aggregate-stats",
    PROCESS_IMAGE = "process-image",
    RESIZE_IMAGE = "resize-image"
}
