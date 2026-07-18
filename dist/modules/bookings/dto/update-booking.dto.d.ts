import { BookingStatus } from '../../../common/constants';
export declare class UpdateBookingDto {
    status?: BookingStatus;
    cancellationReason?: string;
    specialRequests?: string;
}
export declare class AddPassengerDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    passportNumber?: string;
    passportExpiry?: string;
    passportCountry?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    dietaryRequirements?: string;
    medicalConditions?: string;
    email?: string;
    phone?: string;
}
export declare class RemovePassengerDto {
    passengerId: string;
    reason?: string;
}
