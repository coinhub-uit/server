import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VnpayTransactionEntity extends AbstractEntity<VnpayTransactionEntity> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  txnRef: string;

  @Column({ type: 'varchar' })
  sourceDestination: string;

  @Column({ type: 'money' })
  amount: number;

  @Column()
  isPaid: boolean;
}
