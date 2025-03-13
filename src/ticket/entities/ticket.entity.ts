import { MethodEntity } from 'src/method/entities/method.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket_plan_history.entity';
import { SourceEntity } from 'src/user/source/entities/source.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('ticket')
export class TicketEntity extends AbstractEntity<TicketEntity> {
  @PrimaryColumn({ type: 'uuid' })
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
