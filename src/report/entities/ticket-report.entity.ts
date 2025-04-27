import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Entity({ name: 'ticket_report' })
export class TicketReportEntity extends AbstractEntity<TicketReportEntity> {
  @ApiProperty()
  @PrimaryColumn({
    type: 'date',
    default: 'now()',
    transformer: new DateTransformer(),
  })
  date!: Date;

  @ApiProperty()
  @Column({ type: 'int' })
  days!: number;

  @ApiProperty()
  @Column()
  openedCount!: number;

  @ApiProperty()
  @Column()
  closedCount!: number;
}
