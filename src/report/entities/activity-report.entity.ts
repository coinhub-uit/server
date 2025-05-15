import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'activity_report' })
export class ActivityReportEntity extends AbstractEntity<ActivityReportEntity> {
  @PrimaryColumn({
    type: 'date',
    default: 'now()',
    transformer: new DateTransformer(),
  })
  date!: Date;

  @Column({ type: 'int' })
  users!: number;

  @Column({ type: 'int' })
  tickets!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  totalPrincipal!: Decimal;
}
