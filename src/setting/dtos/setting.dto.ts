import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@ApiSchema()
export class SettingDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  minAmountOpenTicket?: number;
}
