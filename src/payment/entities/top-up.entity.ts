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
import { SourceEntity } from 'src/source/entities/source.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiSchema()
@Entity({ name: 'top_up' })
export class TopUpEntity extends AbstractEntity<TopUpEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ enum: TopUpProviderEnum })
  @Column({ type: 'enum', enum: TopUpProviderEnum })
  provider!: TopUpProviderEnum;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  amount: Decimal;

  @Column({
    type: 'enum',
    enum: TopUpStatusEnum,
    default: TopUpStatusEnum.processing,
  })
  status!: TopUpStatusEnum;

  @ManyToOne(() => SourceEntity)
  @JoinColumn()
  sourceDestination: SourceEntity;
}
