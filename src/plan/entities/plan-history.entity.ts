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
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
@Entity('plan_history')
export class PlanHistoryEntity extends AbstractEntity<PlanHistoryEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 4, scale: 2 })
  rate!: number;

  @ApiPropertyOptional({ type: [TicketHistoryEntity] })
  @OneToMany(
    () => TicketHistoryEntity,
    (ticketHistoryEntity) => ticketHistoryEntity.planHistory,
  )
  ticketHistories?: TicketHistoryEntity[];

  @ApiPropertyOptional()
  @ManyToOne(() => PlanEntity, (plan) => plan.planHistories, {
    nullable: false,
  })
  plan?: PlanEntity;
}
