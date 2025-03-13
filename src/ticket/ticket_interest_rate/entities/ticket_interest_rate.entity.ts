import { PlanHistoryEntity } from 'src/plan/entities/plan_history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('ticket_interest_rate')
export class TicketInterestRateEntity {
  @PrimaryColumn({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  maturityDate: Date;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketInterestRates)
  ticket: TicketEntity;

  @ManyToOne(
    () => PlanHistoryEntity,
    (interestRate) => interestRate.ticketInterestRates,
  )
  interestRate: PlanHistoryEntity;
}
