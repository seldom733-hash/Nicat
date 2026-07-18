import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TourCategory } from '../../../common/constants';

export class SearchTourDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  countries?: string;

  @IsString()
  @IsOptional()
  cities?: string;

  @IsEnum(TourCategory)
  @IsOptional()
  category?: TourCategory;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  maxPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  durationDays?: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  services?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  minDuration?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  maxDuration?: number;
}
