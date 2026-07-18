import { User } from '../../users/entities/user.entity';
export declare enum PayoutStatus {
    PENDING = "pending",
    IN_TRANSIT = "in_transit",
    PAID = "paid",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class Payout {
    id: string;
    user: User;
    userId: string;
    stripePayoutId: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    type: string;
    arrivalDate: Date;
    failureReason: string;
    balanceTransactionId: string;
    createdAt: Date;
}
