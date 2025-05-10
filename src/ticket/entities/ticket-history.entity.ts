import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import { DecimalTransformer } from 'src/common/transformers/decimal.transformer';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('ticket_history')
export class TicketHistoryEntity extends AbstractEntity<TicketHistoryEntity> {
  @PrimaryColumn({ type: 'date', transformer: new DateTransformer() })
  issuedAt!: Date;

  @Column({ type: 'date', transformer: new DateTransformer() })
  maturedAt!: Date;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  principal!: Decimal;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  interest!: Decimal;

  @PrimaryColumn()
  ticketId?: number;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketHistories, {
    nullable: false,
  })
  ticket?: TicketEntity;

  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketHistories,
    { nullable: false },
  )
  planHistory?: PlanHistoryEntity;
}
