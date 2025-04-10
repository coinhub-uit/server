import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('device')
export class DeviceEntity extends AbstractEntity<DeviceEntity> {
  @PrimaryColumn({ type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ type: 'text' })
  deviceId: string;

  @Column({ type: 'text' })
  fcmToken!: string;

  @UpdateDateColumn({ type: 'date' })
  @Column({ type: 'date', transformer: new DateTransformer() })
  updatedAt!: Date;

  // NOTE: This relation is not really neccessary. Because we don't join. We already mark userId primary key
  @ManyToOne(() => UserEntity, (user) => user.devices)
  user: UserEntity;
}
