import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Entity({ name: 'settings' })
export class SettingsEntity extends AbstractEntity<SettingsEntity> {
  @PrimaryColumn()
  id!: string;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  minAmountOpenTicket!: Decimal;
}
