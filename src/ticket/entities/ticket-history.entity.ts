import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import Decimal from 'decimal.js';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
@Entity('ticket_history')
export class TicketHistoryEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'date' })
  issueDate!: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  maturityDate!: Date;

  @ApiProperty({ type: String })
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  amount!: Decimal;

  @Exclude()
  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketHistories)
  ticket!: TicketEntity;

  @Exclude()
  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketHistories,
  )
  planHistory!: PlanHistoryEntity;
}
