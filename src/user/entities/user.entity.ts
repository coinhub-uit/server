import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  userName: string;

  @Column()
  password: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'date' })
  birthDay: Date;

  @Index({ unique: true })
  @Column({ type: 'char', length: 12 })
  citizenId: string;

  @Column({ type: 'text', nullable: true })
  pin: string;

  @Column({ type: 'bytea', nullable: true })
  avatar?: Buffer;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => SourceEntity, (source) => source.user)
  sources: SourceEntity[];
}
