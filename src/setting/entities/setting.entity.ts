import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SettingEntity extends AbstractEntity<SettingEntity> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'money' })
  minimumInitMoney: number;
}
