import { SourceEntity } from 'src/user/source/entities/source.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

enum TransactionTypes {
  'deposit',
  'withdraw',
  'interest_payment',
}

@Entity('transaction')
export class TransactionEntity extends AbstractEntity<TransactionEntity> {
  @PrimaryColumn({ type: 'uuid' })
  transactionid: string;

  @Column({ type: 'money' })
  money: number;

  @Column({ type: 'enum', enum: TransactionTypes })
  type: TransactionTypes;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => SourceEntity, (source) => source.transactions)
  source: SourceEntity;
}
