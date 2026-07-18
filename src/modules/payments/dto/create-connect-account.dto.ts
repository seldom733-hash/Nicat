import { IsString, IsOptional, IsIn, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConnectAccountDto {
  @ApiPropertyOptional({
    description: 'Код страны (по умолчанию US)',
    example: 'US',
  })
  @IsString()
  @IsOptional()
  @IsIn(['US', 'GB', 'CA', 'DE', 'FR', 'ES', 'IT', 'AU', 'JP', 'BR'])
  country?: string;

  @ApiPropertyOptional({ description: 'URL для возврата после онбординга' })
  @IsString()
  @IsOptional()
  returnUrl?: string;

  @ApiPropertyOptional({ description: 'URL для обновления при ошибках' })
  @IsString()
  @IsOptional()
  refreshUrl?: string;
}
