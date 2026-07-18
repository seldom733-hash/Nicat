"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobNames = exports.QueueNames = exports.getQueueConfig = void 0;
const getQueueConfig = (redisHost, redisPort, redisPassword) => ({
    redis: {
        host: redisHost,
        port: redisPort,
        password: redisPassword || undefined,
        maxRetriesPerRequest: 3,
    },
});
exports.getQueueConfig = getQueueConfig;
var QueueNames;
(function (QueueNames) {
    QueueNames["EMAIL"] = "nicat-email";
    QueueNames["PAYMENT"] = "nicat-payment";
    QueueNames["NOTIFICATION"] = "nicat-notification";
    QueueNames["SEARCH_INDEX"] = "nicat-search-index";
    QueueNames["ANALYTICS"] = "nicat-analytics";
    QueueNames["FILE_UPLOAD"] = "nicat-file-upload";
})(QueueNames || (exports.QueueNames = QueueNames = {}));
var JobNames;
(function (JobNames) {
    JobNames["SEND_WELCOME_EMAIL"] = "send-welcome-email";
    JobNames["SEND_BOOKING_CONFIRMATION"] = "send-booking-confirmation";
    JobNames["SEND_PAYMENT_RECEIPT"] = "send-payment-receipt";
    JobNames["SEND_CANCELLATION_NOTICE"] = "send-cancellation-notice";
    JobNames["PROCESS_PAYMENT"] = "process-payment";
    JobNames["HANDLE_WEBHOOK"] = "handle-stripe-webhook";
    JobNames["PROCESS_REFUND"] = "process-refund";
    JobNames["GENERATE_INVOICE"] = "generate-invoice";
    JobNames["SEND_PUSH_NOTIFICATION"] = "send-push-notification";
    JobNames["SEND_IN_APP_NOTIFICATION"] = "send-in-app-notification";
    JobNames["INDEX_TOUR"] = "index-tour";
    JobNames["REINDEX_ALL"] = "reindex-all";
    JobNames["GENERATE_REPORT"] = "generate-report";
    JobNames["AGGREGATE_STATS"] = "aggregate-stats";
    JobNames["PROCESS_IMAGE"] = "process-image";
    JobNames["RESIZE_IMAGE"] = "resize-image";
})(JobNames || (exports.JobNames = JobNames = {}));
//# sourceMappingURL=queue.config.js.map