import { MethodEntity } from 'src/method/entities/method.entity';
import { TicketInterestRateEntity } from 'src/ticket/ticket_interest_rate/entities/ticket_interest_rate.entity';
import { SourceEntity } from 'src/user/source/entities/source.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('ticket')
export class TicketEntity extends AbstractEntity<TicketEntity> {
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

  @OneToMany(
    () => TicketInterestRateEntity,
    (ticketInterestRate) => ticketInterestRate.ticket,
  )
  ticketInterestRates: TicketInterestRateEntity[];
}
