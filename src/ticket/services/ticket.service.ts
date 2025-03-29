import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  getTicketById(id: string) {
    return this.ticketRepository.findOneOrFail({ where: { id: id } });
  }

  getTicketByUserId(userId: string) {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.source', 'source')
      .leftJoinAndSelect('source.user', 'user')
      .where('user.id=:userId', { userId })
      .getMany();
  }
}
