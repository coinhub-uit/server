import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TopUpEnum } from 'src/payment/types/top-up.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'top_up' })
export class TopUpEntity extends AbstractEntity<TopUpEntity> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  type: TopUpEnum;

  // TODO: add relationship
  @Column({ type: 'varchar', length: 20 })
  sourceDestination: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean = false;
}
