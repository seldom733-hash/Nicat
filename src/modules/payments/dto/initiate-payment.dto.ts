import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'ID бронирования' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiPropertyOptional({ description: 'Использовать Checkout Session вместо PaymentIntent' })
  @IsBoolean()
  @IsOptional()
  useCheckoutSession?: boolean;

  @ApiPropertyOptional({ description: 'URL успешного возврата для Checkout Session' })
  @IsString()
  @IsOptional()
  successUrl?: string;

  @ApiPropertyOptional({ description: 'URL отмены для Checkout Session' })
  @IsString()
  @IsOptional()
  cancelUrl?: string;
}
