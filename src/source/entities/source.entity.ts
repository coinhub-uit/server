import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('source')
@Check(`"balance"::numeric >= 0`)
export class SourceEntity extends AbstractEntity<SourceEntity> {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'money', default: 0 })
  balance: number;

  @ManyToOne(() => UserEntity, (user) => user.sources)
  user: UserEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.source)
  tickets: TicketEntity[];
}
