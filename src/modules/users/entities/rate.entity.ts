import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Rate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  days: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;
}
