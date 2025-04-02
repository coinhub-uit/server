import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
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
  id!: number;

  @Column({ type: 'date' })
  definedDate!: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rate!: number;

  @OneToMany(
    () => TicketHistoryEntity,
    (ticketHistoryEntity) => ticketHistoryEntity.planHistory,
  )
  ticketHistories!: TicketHistoryEntity[];

  @ManyToOne(() => PlanEntity, (plan) => plan.planHistories)
  plan!: Promise<PlanEntity>;
}
