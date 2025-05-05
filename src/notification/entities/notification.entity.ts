import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('notification')
export class NotificationEntity extends AbstractEntity<NotificationEntity> {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'boolean' })
  isRead!: boolean;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user?: UserEntity;
}
