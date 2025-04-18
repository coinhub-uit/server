import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('device')
export class DeviceEntity extends AbstractEntity<DeviceEntity> {
  @PrimaryColumn({ type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ type: 'text' })
  deviceId: string;

  @Column({ type: 'text' })
  fcmToken!: string;

  // NOTE: This relation is not really neccessary. Because we don't join. We already mark userId primary key
  @ManyToOne(() => UserEntity, (user) => user.devices, { nullable: false })
  user: UserEntity;
}
