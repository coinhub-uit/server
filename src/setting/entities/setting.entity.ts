import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class SettingEntity extends AbstractEntity<SettingEntity> {
  @Column({ type: 'money' })
  minimumInitMoney: number;
}
