import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Entity({ name: 'statistic' })
export class StatisticEntity extends AbstractEntity<StatisticEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'uuid' })
  statId: string;

  @ApiProperty()
  @Column({ type: 'date', transformer: new DateTransformer() })
  date: Date;

  @ApiProperty()
  @Column({ type: 'int' })
  users: number;

  @ApiProperty()
  @Column({ type: 'int' })
  tickets: number;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  deposits: Decimal;
}
