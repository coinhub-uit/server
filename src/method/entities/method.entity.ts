import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('method')
export class MethodEntity {
  @PrimaryColumn('uuid')
  methodId: string;

  @OneToMany(() => TicketEntity, (ticket) => ticket.method)
  tickets: TicketEntity[];
}
