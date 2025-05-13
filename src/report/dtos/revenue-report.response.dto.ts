import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';
import { decimalToString } from 'src/common/transformers/decimal.transformer';

@ApiSchema({ name: RevenueReportResponseDto.name })
export class RevenueReportResponseDto extends AbstractResponseDto<RevenueReportResponseDto> {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  days!: number;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  income!: Decimal;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  expense!: Decimal;

  @ApiProperty({ type: String })
  @Transform(decimalToString, { toPlainOnly: true })
  netIncome!: Decimal;
}
