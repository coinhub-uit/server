import { MethodEntity } from 'src/method/entities/method.entity';
import { SourceEntity } from 'src/user/source/entities/source.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('ticket')
export class TicketEntity {
  @PrimaryColumn({ type: 'uuid' })
  ticketId: string;

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
}
