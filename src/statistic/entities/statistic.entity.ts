import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'statistic' })
export class StatisticEntity extends AbstractEntity<StatisticEntity> {
  @PrimaryColumn({ type: 'uuid' })
  statId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' })
  users: number;

  @Column({ type: 'int' })
  tickets: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  deposits: Decimal;
}
