import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { MethodEnum } from 'src/ticket/types/method.enum';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';

@ApiSchema()
export class TicketResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  openedAt!: Date;

  @ApiProperty({ nullable: true, type: Date })
  closedAt!: Date | null;

  @ApiProperty({ enum: TicketStatusEnum })
  status!: TicketStatusEnum;

  @ApiProperty({ enum: MethodEnum })
  method!: MethodEnum;
}
