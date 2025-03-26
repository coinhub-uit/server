import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';

import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('ticket_history')
export class TicketHistoryEntity {
  @PrimaryColumn({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  maturityDate: Date;

  @Column({ type: 'money' })
  amount: number;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketHistories)
  ticket: TicketEntity;

  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketHistories,
  )
  planHistory: PlanHistoryEntity;
}
