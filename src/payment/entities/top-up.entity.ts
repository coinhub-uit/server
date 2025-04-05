import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { TopUpProviderEnum } from 'src/payment/types/top-up-provider.enum';
import { TopUpStatusEnum } from 'src/payment/types/top-up-status.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ApiSchema()
@Entity({ name: 'top_up' })
export class TopUpEntity extends AbstractEntity<TopUpEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ enum: TopUpProviderEnum })
  @Column({ type: 'enum', enum: TopUpProviderEnum })
  provider!: TopUpProviderEnum;

  // TODO: add relationship? need it?
  @ApiProperty()
  @Column({ type: 'varchar', length: 20 })
  sourceDestinationId!: string;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  amount: Decimal;

  @Column({ enum: TopUpStatusEnum, default: TopUpStatusEnum.processing })
  status!: TopUpStatusEnum;
}
