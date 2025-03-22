import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class StatisticEntity extends AbstractEntity<StatisticEntity> {
  @PrimaryColumn({ type: 'uuid' })
  statId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' })
  users: number;

  @Column({ type: 'int' })
  tickets: number;

  @Column({ type: 'money' })
  deposits: number;
}
