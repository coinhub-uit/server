import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { MethodEnum } from 'src/ticket/types/method.enum';
import {
  Column,
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

  @Column({
    type: 'enum',
    enum: MethodEnum,
  })
  method!: MethodEnum;

  // NOTE: Those excluded relationships may helpful for admin. So we should return empty list or so for user
  @Exclude()
  @ManyToOne(() => SourceEntity, (source) => source.tickets)
  source!: SourceEntity;

  @Exclude()
  @OneToMany(() => TicketHistoryEntity, (ticketHistory) => ticketHistory.ticket)
  ticketHistories!: TicketHistoryEntity[];
}
