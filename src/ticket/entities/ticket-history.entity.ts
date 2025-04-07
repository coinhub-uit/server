import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Entity('ticket_history')
export class TicketHistoryEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'date' })
  issuedAt!: Date;

  @ApiProperty()
  @Column({ type: 'date' })
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

  @Exclude()
  @PrimaryColumn({ name: 'ticketId', type: 'string', nullable: false })
  @ManyToOne(() => TicketEntity, (ticket) => ticket.ticketHistories)
  ticket!: TicketEntity;

  @Exclude()
  @ManyToOne(
    () => PlanHistoryEntity,
    (planHistory) => planHistory.ticketHistories,
  )
  planHistory!: PlanHistoryEntity;
}
