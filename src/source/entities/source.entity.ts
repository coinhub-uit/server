import { UserEntity } from 'src/user/entities/user.entity';
import { Check, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('source')
@Check(`"balance" >= 0`)
export class SourceEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  sourceId: string;

  @Column({ type: 'money', default: 0 })
  balance: number;

  @ManyToOne(() => UserEntity, (user) => user.source)
  user: UserEntity;
}
