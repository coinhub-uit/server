import { User } from 'src/modules/mobile/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'money' })
  money: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  status: boolean;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'id', foreignKeyConstraintName: 'fk_user_id' })
  user: User;
}
