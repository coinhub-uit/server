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

@Entity('ticket')
export class TicketEntity extends AbstractEntity<TicketEntity> {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  openedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  closedAt!: Date | null;

  @Column({
    type: 'enum',
    enum: TicketStatusEnum,
    default: TicketStatusEnum.active,
  })
  status!: TicketStatusEnum;

  @Column({
    type: 'enum',
    enum: MethodEnum,
  })
  method!: MethodEnum;

  @ManyToOne(() => PlanEntity, (plan) => plan.tickets, { nullable: false })
  plan?: PlanEntity;

  @OneToMany(() => TicketHistoryEntity, (ticketHistory) => ticketHistory.ticket)
  ticketHistories?: TicketHistoryEntity[];

  @ManyToOne(() => SourceEntity, (source) => source.tickets, {
    nullable: false,
  })
  source?: SourceEntity;
}
