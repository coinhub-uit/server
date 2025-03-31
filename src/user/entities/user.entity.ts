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
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'User Entity Schema' })
@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @ApiProperty({ required: true })
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty({ required: true })
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt!: string;

  @ApiProperty({ required: true })
  @Column({ type: 'varchar', nullable: false })
  fullname!: string;

  @ApiProperty({ required: true })
  @Column({ type: 'date', nullable: false })
  birthDate!: string;

  @ApiProperty({ required: true })
  @Index({ unique: true })
  @Column({ type: 'char', length: 12, nullable: false })
  citizenId!: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @ApiProperty({ required: false })
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
