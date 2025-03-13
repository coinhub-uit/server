import { PlanHistoryEntity } from 'src/plan/entities/plan_history.entity';

import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('ticket_plan_history')
export class TicketPlanHistoryEntity {
  @PrimaryColumn({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  maturityDate: Date;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketPlanHistories)
  ticket: TicketEntity;

  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketPlanHistories,
  )
  planHistory: PlanHistoryEntity;
}
