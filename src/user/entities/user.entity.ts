import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { URL_PATTERN } from 'lib/regex';

@Entity('user')
export class UserEntity extends AbstractEntity<UserEntity> {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;

  @Column({ type: 'text' })
  fullname!: string;

  @Column({ type: 'date', transformer: new DateTransformer() })
  birthDate!: Date;

  @Index({ unique: true })
  @Column({ name: 'citizenId', type: 'char', length: 12, unique: true })
  citizenId!: string;

  @Transform(
    ({ value, obj }: { value: UserEntity['avatar']; obj: UserEntity }) =>
      value && URL_PATTERN.test(value)
        ? value
        : `${process.env.API_SERVER_URL}/users/${obj.id}/avatar`,
  )
  @Column({ type: 'text', nullable: true })
  avatar!: string | null;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications?: NotificationEntity[];

  @OneToMany(() => SourceEntity, (source) => source.user)
  sources?: SourceEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.user)
  devices?: DeviceEntity[];
}
