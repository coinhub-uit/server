import { Column, Entity } from 'typeorm';

@Entity()
export class SettingEntity {
  @Column({ type: 'money' })
  minimumInitMoney: number;
}
