import { UserRole } from '../../../common/constants';
import { Tour } from '../../tours/entities/tour.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    avatar: string;
    bio: string;
    country: string;
    city: string;
    language: string;
    isEmailVerified: boolean;
    isActive: boolean;
    refreshToken: string;
    stripeAccountId: string;
    isStripeConnected: boolean;
    passportData: string;
    passportEncryptionIV: string;
    passportEncryptionKey: string;
    tours: Tour[];
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
