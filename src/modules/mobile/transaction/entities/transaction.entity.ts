import { User } from 'src/modules/mobile/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  user: User;
}
