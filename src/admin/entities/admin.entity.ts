import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ApiSchema()
@Entity({ name: 'admin' })
export class AdminEntity extends AbstractEntity<AdminEntity> {
  @ApiProperty()
  @PrimaryColumn({ type: 'text' })
  username!: string;

  @Column({ type: 'text' })
  @Exclude()
  password!: string;
}
