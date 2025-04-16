import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { DataSource, Repository } from 'typeorm';
import { PlanService } from 'src/plan/services/plan.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketHistoryEntity)
    private readonly ticketHistoryRepository: Repository<TicketHistoryEntity>,
    private planService: PlanService,
    private dataSource: DataSource,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const ticket = this.ticketRepository.create({
      openedAt: new Date(),
      closedAt: null,
      source: { id: createTicketDto.sourceId },
      method: createTicketDto.method,
    });
    return await this.ticketRepository.save(ticket);
  }
}
