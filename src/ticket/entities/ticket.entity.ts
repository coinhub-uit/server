import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { MethodEntity } from 'src/method/entities/method.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
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

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  openedDate: Date;

  @Column({ type: 'date', nullable: true, default: null })
  closedDate: Date | null;

  @ManyToOne(() => SourceEntity, (source) => source.tickets)
  source: SourceEntity;

  @ManyToOne(() => MethodEntity, (method) => method.tickets)
  method: MethodEntity;

  @OneToMany(() => TicketHistoryEntity, (ticketHistory) => ticketHistory.ticket)
  ticketHistories: TicketHistoryEntity[];
}
