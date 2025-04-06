import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MethodService } from 'src/method/services/method.service';
import { SourceService } from 'src/source/services/source.service';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private sourceService: SourceService,
    private methodService: MethodService,
  ) {}

  async getTicketById(id: number) {
    return await this.ticketRepository.findOneOrFail({ where: { id } });
  }

  async createTicket(createTicketDto: CreateTicketDto) {
    const source = await this.sourceService.getSourceByIdOrFail(
      createTicketDto.sourceId,
    );
    const method = await this.methodService.getMethodById(
      createTicketDto.methodId,
    );
    const ticketEntity = await this.ticketRepository.save({
      source: Promise.resolve(source),
      method: Promise.resolve(method),
    });
    return ticketEntity;
  }
}
