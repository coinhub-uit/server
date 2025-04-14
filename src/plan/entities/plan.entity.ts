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
import { Exclude } from 'class-transformer';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';

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
  // WARNING: This may be not needed and removed in the future
  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ApiProperty()
  @OneToMany(() => PlanHistoryEntity, (planHistory) => planHistory.plan)
  planHistories!: PlanHistoryEntity[];

  @Exclude()
  @OneToMany(() => TicketEntity, (ticket) => ticket.plan)
  tickets: TicketEntity[];
}
