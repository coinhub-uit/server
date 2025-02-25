import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'money' })
  amount: number;

  @Column({ enum: ['deposit', 'withdraw', 'interest_payment'] })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'id', foreignKeyConstraintName: 'fk_user_id' })
  user: User;
}
