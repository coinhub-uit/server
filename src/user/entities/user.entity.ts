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
  Unique,
} from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@ApiSchema()
@Entity('users')
@Unique(['citizenId'])
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
  birthDate!: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ name: 'citizenId', type: 'char', length: 12, nullable: false })
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
