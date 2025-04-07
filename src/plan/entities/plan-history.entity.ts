import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('plan_history')
export class PlanHistoryEntity extends AbstractEntity<PlanHistoryEntity> {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @CreateDateColumn({ type: 'date' })
  createdAt!: Date;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  rate!: number;

  @OneToMany(
    () => TicketHistoryEntity,
    (ticketHistoryEntity) => ticketHistoryEntity.planHistory,
  )
  ticketHistories!: Promise<TicketHistoryEntity[]>;

  @ManyToOne(() => PlanEntity, (plan) => plan.planHistories)
  plan!: Promise<PlanEntity>;
}
