import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
@Entity('plan')
@Unique(['days'])
export class PlanEntity extends AbstractEntity<PlanEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty()
  @Column({ name: 'days', type: 'int', unique: true })
  days!: number;

  // TODO: Check this!! What is the logic here
  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => PlanHistoryEntity, (planHistory) => planHistory.plan)
  planHistories!: PlanHistoryEntity[];
}
