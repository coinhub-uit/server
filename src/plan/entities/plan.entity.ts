import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';

@ApiSchema()
@Entity('plan')
@Unique(['days'])
export class PlanEntity extends AbstractEntity<PlanEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty()
  @Column({ type: 'int', unique: true })
  days!: number;

  @ApiPropertyOptional({ type: [PlanHistoryEntity] })
  @OneToMany(() => PlanHistoryEntity, (planHistory) => planHistory.plan)
  planHistories?: PlanHistoryEntity[];

  @ApiPropertyOptional({ type: [TicketEntity] })
  @OneToMany(() => TicketEntity, (ticket) => ticket.plan)
  tickets?: TicketEntity[];
}
