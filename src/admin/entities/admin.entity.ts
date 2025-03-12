import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminEntity extends AbstractEntity<AdminEntity> {
  @PrimaryColumn({ type: 'varchar' })
  username: string;

  @Column({ type: 'text' })
  password: string;
}
