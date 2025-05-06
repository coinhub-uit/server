import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ticket_report' })
export class TicketReportEntity extends AbstractEntity<TicketReportEntity> {
  @PrimaryColumn({
    type: 'date',
    default: 'now()',
    transformer: new DateTransformer(),
  })
  date!: Date;

  @PrimaryColumn({ type: 'int' })
  days!: number;

  @Column()
  openedCount!: number;

  @Column()
  closedCount!: number;
}
