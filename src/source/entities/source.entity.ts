import { Transform } from 'class-transformer';
import Decimal from 'decimal.js';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import {
  decimalToString,
  DecimalTransformer,
} from 'src/common/transformers/decimal.transformer';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('source')
@Check(`"balance"::numeric >= 0`)
export class SourceEntity extends AbstractEntity<SourceEntity> {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 0,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  @Transform(decimalToString, { toPlainOnly: true })
  balance: Decimal;

  @ManyToOne(() => UserEntity, (user) => user.sources)
  user: UserEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.source)
  tickets: TicketEntity[];
}
