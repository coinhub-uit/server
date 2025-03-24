import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MethodId } from 'src/method/types/method-id.enum';

@Entity('method')
export class MethodEntity extends AbstractEntity<MethodEntity> {
  @PrimaryColumn({ type: 'enum', enum: MethodId })
  id: MethodId;

  @OneToMany(() => TicketEntity, (ticket) => ticket.method)
  tickets: TicketEntity[];
}
