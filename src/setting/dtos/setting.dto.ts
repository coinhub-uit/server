import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

@ApiSchema()
export class SettingDto {
  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  minAmountOpenTicket?: string;
}
