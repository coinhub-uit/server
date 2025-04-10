import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';
import dataSource from 'database/datasource';
import { PlanService } from 'src/plan/services/plan.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketHistoryEntity)
    private readonly ticketHistoryRepository: Repository<TicketHistoryEntity>,
    private planService: PlanService,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const now = new Date();
    const ticketEntity = await this.ticketRepository.save({
      openedAt: now,
      closedAt: null,
      source: { id: createTicketDto.sourceId },
      method: createTicketDto.method,
    });
    let ticketHistoryEntity: TicketHistoryEntity;
    if ((createTicketDto.method as string) === 'NR') {
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
      issuedAt: ticketEntity.openedAt,
      maturedAt: new Date().setDate(
        ticketEntity.openedAt.getDate() + planHistoryEntity.plan.days,
      ),
      planHistory: planHistoryEntity,
      ticket: ticketEntity,
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
