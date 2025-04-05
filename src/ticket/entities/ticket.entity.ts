import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { MethodEntity } from 'src/method/entities/method.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
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
  @CreateDateColumn({ type: 'timestamptz' })
  openedAt!: Date;

  @ApiProperty({ nullable: true, type: Date })
  @DeleteDateColumn({ type: 'timestamptz' })
  closedAt!: Date | null;

  @Exclude()
  @ManyToOne(() => SourceEntity, (source) => source.tickets)
  source!: Promise<SourceEntity>;

  @Exclude()
  @ManyToOne(() => MethodEntity, (method) => method.tickets)
  method!: Promise<MethodEntity>;

  @Exclude()
  @OneToMany(() => TicketHistoryEntity, (ticketHistory) => ticketHistory.ticket)
  ticketHistories!: TicketHistoryEntity[];
}
