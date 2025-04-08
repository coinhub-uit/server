import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MethodService } from 'src/method/services/method.service';
import { PlanService } from 'src/plan/services/plan.service';
import { SourceService } from 'src/source/services/source.service';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';
import dataSource from 'database/datasource';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private readonly ticketHistoryRepository: Repository<TicketHistoryEntity>,
    private planService: PlanService,
    private sourceService: SourceService,
    private methodService: MethodService,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const ticketEntity = await this.ticketRepository.save({
      source: { id: createTicketDto.sourceId },
      method: { id: createTicketDto.methodId },
    });
    let ticketHistoryEntity: TicketHistoryEntity;
    if ((createTicketDto.methodId as string) === 'NR') {
      ticketHistoryEntity = await this.handleNRTicket(
        ticketEntity,
        createTicketDto,
      );
    } else {
      //TODO: Handle two remains case
      ticketHistoryEntity = new TicketHistoryEntity();
    }
    return { ticket: ticketEntity, ticketHistory: ticketHistoryEntity };
  }

  private async handleNRTicket(
    ticketEntity: TicketEntity,
    createTicketDto: CreateTicketDto,
  ) {
    const planHistoryEntity = await this.planService.findPlanHistoryById(
      createTicketDto.planHistoryId,
    );
    const ticketHistory = await this.ticketHistoryRepository.save({
      amount: createTicketDto.amount,
      issuedAt: new Date(),
      maturedAt: new Date('9999-12-31'),
      planHistory: Promise.resolve(planHistoryEntity),
      ticket: Promise.resolve(ticketEntity),
    });
    return ticketHistory;
  }

  async closeTicket(ticketEntity: TicketEntity) {
    const now = new Date();
    ticketEntity.closedAt = now;
    const latestTicketHistory = await dataSource
      .getRepository(TicketHistoryEntity)
      .createQueryBuilder('history')
      .where('history.ticketId = :ticketId', { ticketId: ticketEntity.id })
      .orderBy('history.issuedAt', 'DESC')
      .getOne();
    latestTicketHistory!.maturedAt = now;
    return {
      ticket: await this.ticketRepository.save(ticketEntity),
      ticketHistory: await this.ticketHistoryRepository.save(
        latestTicketHistory!,
      ),
    };
  }
}
