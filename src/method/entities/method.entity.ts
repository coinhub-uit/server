import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('method')
export class MethodEntity extends AbstractEntity<MethodEntity> {
  @PrimaryColumn({ type: 'varchar', length: 3 })
  id: 'NR' | 'PR' | 'PIR';

  @OneToMany(() => TicketEntity, (ticket) => ticket.method)
  tickets: TicketEntity[];
}
