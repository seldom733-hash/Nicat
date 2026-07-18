import { Booking } from './booking.entity';
export declare class Passenger {
    id: string;
    booking: Booking;
    bookingId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: Date;
    passportCountry: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    dietaryRequirements: string;
    medicalConditions: string;
    isLeadPassenger: boolean;
    email: string;
    phone: string;
}
