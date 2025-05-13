import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';

@ApiSchema({ name: TicketReportResponseDto.name })
export class TicketReportResponseDto extends AbstractResponseDto<TicketReportResponseDto> {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  days!: number;

  @ApiProperty()
  openedCount!: number;

  @ApiProperty()
  closedCount!: number;
}
