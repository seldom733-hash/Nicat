import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { CreateTourDto } from './create-tour.dto';
import { TourStatus } from '../../../common/constants';

export class UpdateTourDto extends PartialType(CreateTourDto) {
  @IsEnum(TourStatus)
  @IsOptional()
  status?: TourStatus;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  averageRating?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reviewCount?: number;
}
