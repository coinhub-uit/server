import { Ticket } from 'src/modules/users/entities/ticket.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Method {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Ticket, (ticket) => ticket.method)
  tickets: Ticket[];
}
