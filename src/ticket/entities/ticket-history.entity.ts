import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { DateTransformer } from 'src/common/transformers/date.transformer';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Entity('ticket_history')
export class TicketHistoryEntity extends AbstractEntity<TicketHistoryEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'date', transformer: new DateTransformer() })
  issuedAt!: Date;

  @ApiProperty()
  @Column({ type: 'date', transformer: new DateTransformer() })
  maturedAt!: Date;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  amount!: Decimal;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  maturedInterest!: Decimal;

  @ApiPropertyOptional()
  @PrimaryColumn()
  ticketId?: number;

  @ApiPropertyOptional()
  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketHistories, {
    nullable: false,
  })
  ticket?: TicketEntity;

  @ApiPropertyOptional()
  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketHistories,
    { nullable: false },
  )
  planHistory?: PlanHistoryEntity;
}
