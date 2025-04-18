import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { Check, Column, Entity, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Check(`"id" = true`)
@Entity({ name: 'settings' })
export class SettingsEntity extends AbstractEntity<SettingsEntity> {
  @PrimaryColumn({ type: 'boolean', default: true })
  id!: true;

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
