import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class AdminEntity extends AbstractEntity<AdminEntity> {
  @PrimaryColumn({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  @Exclude()
  password: string;
}
