import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminEntity {
  @PrimaryColumn({ type: 'nvarchar', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;
}
