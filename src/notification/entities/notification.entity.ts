import { UserEntity } from 'src/user/entities/user.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('notification')
export class NotificationEntity extends AbstractEntity<NotificationEntity> {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean' })
  isSeen: boolean;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
