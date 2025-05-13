import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';
import { decimalToString } from 'src/common/transformers/decimal.transformer';

@ApiSchema()
export class SourceResponseDto extends AbstractResponseDto<SourceResponseDto> {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  balance!: Decimal;
}
