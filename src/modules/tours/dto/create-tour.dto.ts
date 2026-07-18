import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TourCategory, DifficultyLevel } from '../../../common/constants';

export class CreateItineraryItemDto {
  @IsNumber()
  dayNumber: number;

  @IsNumber()
  sortOrder: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateTourMediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsEnum(TourCategory)
  @IsOptional()
  category?: TourCategory;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  minGroupSize?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxGroupSize?: number;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  commissionRate?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(1)
  durationDays: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryItemDto)
  @IsOptional()
  itinerary?: CreateItineraryItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTourMediaDto)
  @IsOptional()
  media?: CreateTourMediaDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services?: string[];
}
