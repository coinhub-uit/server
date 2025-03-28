import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  username!: string;

  @Column({ type: 'varchar' })
  fullname!: string;

  @Column({ type: 'date' })
  birthDate!: string;

  @Index({ unique: true })
  @Column({ type: 'char', length: 12 })
  citizenId!: string;

  // TODO: think again do we need it in databaes
  @Exclude()
  @Column({ type: 'text', nullable: true })
  pin: string;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[];

  @OneToMany(() => SourceEntity, (source) => source.user, {
    cascade: true,
  })
  sources: SourceEntity[];
}
