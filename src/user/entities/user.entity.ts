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
import { Exclude } from 'class-transformer';

@ApiSchema()
@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt!: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  fullname!: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: false })
  birthDate!: Date;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'char', length: 12, nullable: false })
  citizenId!: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  avatar!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Exclude()
  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: Promise<NotificationEntity[]>;

  @Exclude()
  @OneToMany(() => SourceEntity, (source) => source.user, {
    cascade: true,
  })
  sources: Promise<SourceEntity[]>;
}
