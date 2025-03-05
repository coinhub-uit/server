import { SourceEntity } from 'src/user/source/entities/source.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryColumn({ type: 'uuid' })
  transactionid: string;

  @Column({ type: 'money' })
  money: number;

  @Column({ type: 'enum' })
  type: 'deposit' | 'withdraw' | 'interest_payment';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => SourceEntity, (source) => source.transactions)
  source: SourceEntity;
}
