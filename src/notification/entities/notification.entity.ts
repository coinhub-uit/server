import { UserEntity } from 'src/user/entities/user.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@ApiSchema()
@Entity('notification')
export class NotificationEntity extends AbstractEntity<NotificationEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'varchar' })
  title!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content!: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: 'boolean' })
  isSeen!: boolean;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: Promise<UserEntity>;
}
