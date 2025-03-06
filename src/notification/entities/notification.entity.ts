import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('notification')
export class NotificationEntity {
  @PrimaryColumn({ type: 'uuid' })
  notificationId: number;

  @Index()
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
