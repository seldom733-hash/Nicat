import { PaymentStatus } from '../../../common/constants';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../users/entities/user.entity';
export declare class Payment {
    id: string;
    booking: Booking;
    bookingId: string;
    payer: User;
    payerId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    stripePaymentIntentId: string;
    stripeChargeId: string;
    stripeTransferId: string;
    paymentMethod: string;
    failureReason: string;
    paidAt: Date;
    refundedAt: Date;
    createdAt: Date;
}
