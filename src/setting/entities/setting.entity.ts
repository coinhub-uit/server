import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SettingEntity extends AbstractEntity<SettingEntity> {
  @PrimaryGeneratedColumn()
  settingId: string;

  @Column({ type: 'money' })
  minimumInitMoney: number;
}
