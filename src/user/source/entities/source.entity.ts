import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
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
export class SourceEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  sourceId: string;

  @Column({ type: 'money', default: 0 })
  balance: number;

  @ManyToOne(() => UserEntity, (user) => user.sources)
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.source)
  transactions: TransactionEntity[];

  @OneToMany(() => TicketEntity, (ticket) => ticket.source)
  tickets: TicketEntity[];
}
