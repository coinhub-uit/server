import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('method')
export class MethodEntity extends AbstractEntity<MethodEntity> {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => TicketEntity, (ticket) => ticket.method)
  tickets: TicketEntity[];
}
