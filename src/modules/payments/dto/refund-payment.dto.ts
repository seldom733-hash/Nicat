import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefundPaymentDto {
  @ApiProperty({ description: 'ID платежа' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiPropertyOptional({ description: 'Сумма возврата (если не указана — полный возврат)' })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Причина возврата',
    enum: ['duplicate', 'fraudulent', 'requested_by_customer'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['duplicate', 'fraudulent', 'requested_by_customer'])
  reason?: string;
}
