import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  async getTicketById(id: number) {
    return await this.ticketRepository.findOneOrFail({ where: { id } });
  }

  async createTicket(createTicketDto: CreateTicketDto) {
    const ticketEntity = await this.ticketRepository.save({
      source: { id: createTicketDto.sourceId },
      method: createTicketDto.method,
    });
    return ticketEntity;
  }
}
