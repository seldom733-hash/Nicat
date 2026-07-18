import { IsString, IsOptional, IsEnum, IsNotEmpty, IsEmail } from 'class-validator';
import { BookingStatus } from '../../../common/constants';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @IsString()
  @IsOptional()
  specialRequests?: string;
}

export class AddPassengerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsOptional()
  passportNumber?: string;

  @IsString()
  @IsOptional()
  passportExpiry?: string;

  @IsString()
  @IsOptional()
  passportCountry?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  dietaryRequirements?: string;

  @IsString()
  @IsOptional()
  medicalConditions?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class RemovePassengerDto {
  @IsString()
  @IsNotEmpty()
  passengerId: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
