import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionEntity extends AbstractEntity<TransactionEntity> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  txnRef: string;

  @Column({ type: 'varchar' })
  sourceDestination: string;

  @Column({ type: 'money' })
  amount: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean = false;
}
