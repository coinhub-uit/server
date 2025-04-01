import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { MethodEntity } from 'src/method/entities/method.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiSchema()
@Entity('ticket')
export class TicketEntity extends AbstractEntity<TicketEntity> {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @ApiProperty()
  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  openedDate!: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: true, default: null })
  closedDate!: Date | null;

  @Exclude()
  @ManyToOne(() => SourceEntity, (source) => source.tickets)
  source!: Promise<SourceEntity>;

  @Exclude()
  @ManyToOne(() => MethodEntity, (method) => method.tickets)
  method!: MethodEntity;

  @Exclude()
  @OneToMany(() => TicketHistoryEntity, (ticketHistory) => ticketHistory.ticket)
  ticketHistories!: TicketHistoryEntity[];
}
