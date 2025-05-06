import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: TicketReportResponseDto.name })
export class TicketReportResponseDto {
  @ApiProperty()
  date!: Date;

  @ApiProperty()
  days!: number;

  @ApiProperty()
  openedCount!: number;

  @ApiProperty()
  closedCount!: number;
}
