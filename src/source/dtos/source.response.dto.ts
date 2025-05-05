import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { decimalToString } from 'src/common/transformers/decimal.transformer';

@ApiSchema()
export class SourceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  balance!: Decimal;
}
