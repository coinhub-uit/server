import { Column, Entity } from 'typeorm';

@Entity()
export class StatisticEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' })
  users: number;

  @Column({ type: 'int' })
  tickets: number;

  @Column({ type: 'money' })
  deposits: number;
}
