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
  Unique,
} from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@ApiSchema()
@Entity('user')
@Unique(['citizenId'])
export class UserEntity extends AbstractEntity<UserEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({ nullable: true, type: Date })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;

  @ApiProperty()
  @Column({ type: 'text' })
  fullname!: string;

  @ApiProperty()
  @Column({ type: 'date' })
  birthDate!: Date;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ name: 'citizenId', type: 'char', length: 12 })
  citizenId!: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  avatar!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Exclude()
  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: Promise<NotificationEntity[]>;

  @Exclude()
  @OneToMany(() => SourceEntity, (source) => source.user)
  sources: Promise<SourceEntity[]>;
}
