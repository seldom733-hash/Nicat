import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  tourId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
