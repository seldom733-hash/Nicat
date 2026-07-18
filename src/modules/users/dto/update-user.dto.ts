import { IsString, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { UserRole } from '../../../common/constants';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  language?: string;

  @IsBoolean()
  @IsOptional()
  isStripeConnected?: boolean;

  @IsString()
  @IsOptional()
  stripeAccountId?: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
