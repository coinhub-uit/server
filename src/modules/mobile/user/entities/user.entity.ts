import { Notification } from 'src/modules/mobile/notification/entities/notification.entity';
import { Ticket } from 'src/modules/mobile/ticket/entities/ticket.entity';
import { Transaction } from 'src/modules/mobile/transaction/entities/transaction.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Check,
  OneToMany,
} from 'typeorm';

@Entity()
@Check(`"money">=0`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  pin: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  isActive: boolean;

  @Column({ type: 'money', default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
