import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'settings' })
export class SettingsEntity extends AbstractEntity<SettingsEntity> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'money' })
  minAmountOpenTicket: number;
}
