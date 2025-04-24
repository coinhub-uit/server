import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
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
  CreateDateColumn,
  Entity,
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
  amount!: Decimal;

  @ApiProperty({ enum: TopUpStatusEnum })
  @Column({
    type: 'enum',
    enum: TopUpStatusEnum,
    default: TopUpStatusEnum.processing,
  })
  status!: TopUpStatusEnum;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiPropertyOptional({ type: () => SourceEntity })
  @ManyToOne(() => SourceEntity, (source) => source.topUps, { nullable: false })
  sourceDestination?: SourceEntity;
}
