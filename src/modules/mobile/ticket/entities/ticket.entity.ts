import { User } from 'src/modules/mobile/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  user: User;
}
