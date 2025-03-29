import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceService } from 'src/source/services/source.service';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private sourceService: SourceService,
  ) {}

  getTicketById(id: string) {
    return this.ticketRepository.findOneOrFail({ where: { id: id } });
  }

  async getTicketByUserId(userId: string) {
    const sources = await this.sourceService.getSourceByUserId(userId);
    const tickets = await Promise.all(
      sources.map((source) => this.sourceService.getSourceById(source.id)),
    );
    return tickets;
  }
}
