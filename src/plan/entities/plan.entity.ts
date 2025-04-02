import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  EntityManager,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('plan')
@Unique(['days'])
export class PlanEntity extends AbstractEntity<PlanEntity> {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({ name: 'days', type: 'int', unique: true })
  days!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => PlanHistoryEntity, (planHistory) => planHistory.plan)
  planHistories!: Promise<PlanHistoryEntity[]>;

  // TODO: Refactor to ../subcribers/plan.subscriber.ts like admin module. Currently it's empty bruh @NTGNguyen
  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  async refreshAvailablePlan(manager: EntityManager) {
    await manager.query('REFRESH MATERIALIZED VIEW available_plan;');
  }
}
