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
  DeleteDateColumn,
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
  @DeleteDateColumn({ type: 'timestamptz' })
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

  @Exclude()
  @ManyToOne(() => PlanEntity, (plan) => plan.tickets, { nullable: false })
  plan?: PlanEntity;

  @Exclude()
  @OneToMany(() => TicketHistoryEntity, (ticketHistory) => ticketHistory.ticket)
  ticketHistories?: TicketHistoryEntity[];

  @Exclude()
  @ManyToOne(() => SourceEntity, (source) => source.tickets, {
    nullable: false,
  })
  source?: SourceEntity;
}
