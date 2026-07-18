import { OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bull';
export declare class QueueService implements OnModuleInit {
    private emailQueue;
    private paymentQueue;
    private notificationQueue;
    private searchIndexQueue;
    private analyticsQueue;
    private fileUploadQueue;
    private readonly logger;
    constructor(emailQueue: Queue, paymentQueue: Queue, notificationQueue: Queue, searchIndexQueue: Queue, analyticsQueue: Queue, fileUploadQueue: Queue);
    onModuleInit(): Promise<void>;
    sendWelcomeEmail(data: {
        email: string;
        firstName: string;
    }): Promise<import("bull").Job<any>>;
    sendBookingConfirmation(data: {
        email: string;
        bookingReference: string;
        tourTitle: string;
        tourDate: string;
        totalPrice: number;
    }): Promise<import("bull").Job<any>>;
    sendPaymentReceipt(data: {
        email: string;
        paymentId: string;
        amount: number;
        currency: string;
    }): Promise<import("bull").Job<any>>;
    processPayment(data: {
        bookingId: string;
        userId: string;
        amount: number;
        currency: string;
    }): Promise<import("bull").Job<any>>;
    handleWebhook(data: {
        eventType: string;
        payload: any;
    }): Promise<import("bull").Job<any>>;
    sendPushNotification(data: {
        userId: string;
        title: string;
        body: string;
        data?: any;
    }): Promise<import("bull").Job<any>>;
    sendInAppNotification(data: {
        userId: string;
        type: string;
        title: string;
        message: string;
        metadata?: any;
    }): Promise<import("bull").Job<any>>;
    indexTour(data: {
        tourId: string;
        action: 'create' | 'update' | 'delete';
    }): Promise<import("bull").Job<any>>;
    reindexAll(): Promise<import("bull").Job<any>>;
    generateReport(data: {
        type: string;
        startDate: string;
        endDate: string;
        userId?: string;
    }): Promise<import("bull").Job<any>>;
    aggregateStats(): Promise<import("bull").Job<any>>;
    processImage(data: {
        fileId: string;
        operations: string[];
    }): Promise<import("bull").Job<any>>;
    resizeImage(data: {
        fileId: string;
        widths: number[];
        format: 'jpeg' | 'png' | 'webp';
    }): Promise<import("bull").Job<any>>;
    getQueueStats(): Promise<{
        name: string;
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }[]>;
    private logQueueStats;
    cleanQueues(): Promise<void>;
}
