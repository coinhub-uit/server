import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { decimalToString } from 'src/common/transformers/decimal.transformer';

@ApiSchema({ name: ActivityReportResponseDto.name })
export class ActivityReportResponseDto {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  users!: number;

  @ApiProperty()
  tickets!: number;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  totalPrincipal!: Decimal;
}
