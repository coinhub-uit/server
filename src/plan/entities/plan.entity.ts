import { PlanHistoryEntity } from 'src/plan/entities/plan_history.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
export class PlanEntity extends AbstractEntity<PlanEntity> {
  @PrimaryGeneratedColumn('increment')
  planId: number;

  @Column({ type: 'int', unique: true })
  days: number;

  @Column()
  isDisabled: boolean;

  @OneToMany(() => PlanHistoryEntity, (planHistory) => planHistory.plan)
  planHistories: PlanHistoryEntity[];
}
