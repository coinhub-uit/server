import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { MethodEnum } from 'src/ticket/types/method.enum';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiSchema()
@Entity('ticket')
export class TicketEntity extends AbstractEntity<TicketEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  openedAt!: Date;

  @ApiProperty({ nullable: true, type: Date })
  @Column({ type: 'timestamptz', nullable: true })
  closedAt!: Date | null;

  @ApiProperty({ enum: TicketStatusEnum })
  @Column({
    type: 'enum',
    enum: TicketStatusEnum,
    default: TicketStatusEnum.active,
  })
  status!: TicketStatusEnum;

  @ApiProperty({ enum: MethodEnum })
  @Column({
    type: 'enum',
    enum: MethodEnum,
  })
  method!: MethodEnum;

  @ApiProperty({
    type: [TicketHistoryEntity],
  })
  @OneToMany(
    () => TicketHistoryEntity,
    (ticketHistory) => ticketHistory.ticket,
    {
      eager: true, // This because we don't mark this as undefined
    },
  )
  ticketHistories: TicketHistoryEntity[];

  @ApiProperty()
  @ManyToOne(() => PlanEntity, (plan) => plan.tickets, {
    nullable: false,
    eager: true,
  })
  plan: PlanEntity;

  @Exclude()
  @ManyToOne(() => SourceEntity, (source) => source.tickets, {
    nullable: false,
  })
  source?: SourceEntity;
}
