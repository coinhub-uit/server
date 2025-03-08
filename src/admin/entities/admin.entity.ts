import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AdminEntity {
  @PrimaryColumn({ type: 'varchar' })
  username: string;

  @Column({ type: 'text' })
  password: string;
}
