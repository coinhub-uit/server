import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/user/source/entities/source.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  userName: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'date' })
  birthDay: Date;

  @Column({ type: 'text', nullable: true })
  pin: string;

  @Column({ type: 'bytea', nullable: true })
  avatar: Buffer;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => SourceEntity, (source) => source.user)
  sources: SourceEntity[];
}
