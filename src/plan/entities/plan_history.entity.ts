import { PlanEntity } from 'src/plan/entities/plan.entity';
import { TicketInterestRateEntity } from 'src/ticket/ticket_interest_rate/entities/ticket_interest_rate.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('plan_history')
export class PlanHistoryEntity {
  @PrimaryGeneratedColumn('increment')
  planHistoryId: number;

  @Column({ type: 'date' })
  definedDate: Date;

  @Column({ type: 'decimal' })
  rate: number;

  @OneToMany(
    () => TicketInterestRateEntity,
    (ticketInterestRateEntity) => ticketInterestRateEntity.interestRate,
  )
  ticketInterestRates: TicketInterestRateEntity[];

  @ManyToOne(() => PlanEntity, (plan) => plan.planHistories)
  plan: PlanEntity;
}
