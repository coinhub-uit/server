import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { decimalToString } from 'src/common/transformers/decimal.transformer';

@ApiSchema()
export class TicketHistoryResponseDto {
  @ApiProperty()
  issuedAt!: Date;

  @ApiProperty()
  maturedAt!: Date;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  principal!: Decimal;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  interest!: Decimal;
}
