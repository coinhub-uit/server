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
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiSchema()
@Entity('notification')
export class NotificationEntity extends AbstractEntity<NotificationEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'text' })
  title!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  body!: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Exclude()
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user?: UserEntity;
}
