export declare class CreatePassengerDto {
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
    isLeadPassenger?: boolean;
    email?: string;
    phone?: string;
}
export declare class CreateBookingDto {
    tourId: string;
    tourDate: string;
    numberOfPassengers: number;
    passengers: CreatePassengerDto[];
    specialRequests?: string;
}
