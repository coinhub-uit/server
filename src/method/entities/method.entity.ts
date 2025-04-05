import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MethodEnum } from 'src/method/types/method.enum';

@ApiSchema()
@Entity('method')
export class MethodEntity extends AbstractEntity<MethodEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'varchar', length: 3 })
  id!: MethodEnum;

  @Exclude()
  @OneToMany(() => TicketEntity, (ticket) => ticket.method)
  tickets!: Promise<TicketEntity[]>;
}
