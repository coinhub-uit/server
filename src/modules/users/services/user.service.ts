import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Method } from 'src/modules/users/entities/method.entity';
import { Ticket } from 'src/modules/users/entities/ticket.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Method) private methodRepository: Repository<Method>,
  ) {}
}
