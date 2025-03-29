import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import Decimal from 'decimal.js';

@Entity('ticket_history')
export class TicketHistoryEntity {
  @PrimaryColumn({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  maturityDate: Date;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  amount: Decimal;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketHistories)
  ticket: TicketEntity;

  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketHistories,
  )
  planHistory: PlanHistoryEntity;
}
