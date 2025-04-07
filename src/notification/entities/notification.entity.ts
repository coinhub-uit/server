import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: 'boolean' })
  isSeen!: boolean;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}
