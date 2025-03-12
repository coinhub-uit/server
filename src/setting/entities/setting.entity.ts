import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SettingEntity extends AbstractEntity<SettingEntity> {
  @PrimaryColumn({ type: 'uuid' })
  settingId: string;

  @Column({ type: 'money' })
  minimumInitMoney: number;
}
