import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket-plan-history.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('plan_history')
export class PlanHistoryEntity extends AbstractEntity<PlanHistoryEntity> {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date' })
  definedDate: Date;

  @Column({ type: 'decimal' })
  rate: number;

  @OneToMany(
    () => TicketPlanHistoryEntity,
    (ticketPlanHistoryEntity) => ticketPlanHistoryEntity.planHistory,
  )
  ticketPlanHistories: TicketPlanHistoryEntity[];

  @ManyToOne(() => PlanEntity, (plan) => plan.planHistories)
  plan: PlanEntity;
}
