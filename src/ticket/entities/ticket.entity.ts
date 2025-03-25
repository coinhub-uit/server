import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { MethodEntity } from 'src/method/entities/method.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket-plan-history.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ticket')
export class TicketEntity extends AbstractEntity<TicketEntity> {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'money' })
  initMoney: number;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  closedDate: Date;

  @ManyToOne(() => SourceEntity, (source) => source.tickets)
  source: SourceEntity;

  @ManyToOne(() => MethodEntity, (method) => method.tickets)
  method: MethodEntity;

  @OneToMany(
    () => TicketPlanHistoryEntity,
    (ticketPlanHistory) => ticketPlanHistory.ticket,
  )
  ticketPlanHistories: TicketPlanHistoryEntity[];
}
