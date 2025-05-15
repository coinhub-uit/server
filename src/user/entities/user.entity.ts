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
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import { DeviceEntity } from 'src/user/entities/device.entity';
import { URL_PATTERN } from 'lib/regex';

@ApiSchema({ name: UserEntity.name })
@Entity('user')
export class UserEntity extends AbstractEntity<UserEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({ nullable: true, type: Date, example: null })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;

  @ApiProperty()
  @Column({ type: 'text' })
  fullname!: string;

  @ApiProperty()
  @Column({ type: 'date', transformer: new DateTransformer() })
  birthDate!: Date;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ name: 'citizenId', type: 'char', length: 12, unique: true })
  citizenId!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Avatar URL' })
  @Transform(
    ({ value, obj }: { value: UserEntity['avatar']; obj: UserEntity }) =>
      value && URL_PATTERN.test(value)
        ? value
        : `${process.env.API_SERVER_URL}/users/${obj.id}/avatar`,
  )
  @Column({ type: 'text', nullable: true })
  avatar!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications?: NotificationEntity[];

  @OneToMany(() => SourceEntity, (source) => source.user)
  sources?: SourceEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.user)
  devices?: DeviceEntity[];
}
