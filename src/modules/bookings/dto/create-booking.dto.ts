import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  IsUUID,
  Min,
  Max,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
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

  @IsDateString()
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

  @IsBoolean()
  @IsOptional()
  isLeadPassenger?: boolean;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class CreateBookingDto {
  @IsUUID()
  tourId: string;

  @IsDateString()
  tourDate: string;

  @IsNumber()
  @Min(1)
  @Max(50)
  numberOfPassengers: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePassengerDto)
  passengers: CreatePassengerDto[];

  @IsString()
  @IsOptional()
  specialRequests?: string;
}
