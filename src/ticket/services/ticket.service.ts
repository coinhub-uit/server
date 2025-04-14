import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { DataSource, Repository } from 'typeorm';
import { PlanService } from 'src/plan/services/plan.service';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';
import Decimal from 'decimal.js';

type FindTicketHistoryParams = {
  id: number;
  issuedAt: Date;
  ticketEntity?: boolean;
  planHistory?: boolean;
};

type SettlementTicketParams = {
  endDate: Date;
  ticketId: number;
  money: number;
};

type FindTicketParams = {
  id: number;
  ticketHistories?: boolean;
  source?: boolean;
};

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketHistoryEntity)
    private readonly ticketHistoryRepository: Repository<TicketHistoryEntity>,
    @InjectRepository(SourceEntity)
    private readonly sourceRepository: Repository<SourceEntity>,
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

  async createTicketHistory(
    ticketEntity: TicketEntity,
    createTicketDto: CreateTicketDto,
  ) {
    const planHistoryEntity = await this.planService.findPlanHistoryById(
      createTicketDto.planHistoryId,
    );

    const ticketHistory = await this.ticketHistoryRepository.save({
      amount: createTicketDto.amount,
      issuedAt: ticketEntity.openedAt,
      maturedAt: new Date(
        new Date().setDate(
          ticketEntity.openedAt.getDate() + planHistoryEntity.plan.days,
        ),
      ),
      planHistory: planHistoryEntity,
      ticket: ticketEntity,
    });
    return ticketHistory;
  }

  private async findTicketHistoryWithTheirRelations({
    id,
    issuedAt,
    ...relations
  }: FindTicketHistoryParams) {
    const ticket = await this.ticketHistoryRepository.findOne({
      where: { ticketId: id, issuedAt: issuedAt },
      relations: relations,
    });
    if (!ticket) {
      throw new TicketNotExistException();
    }
    return ticket;
  }

  private async calculateInterest(ticketId: number, endDate: Date) {
    const ticket = await this.findTicketWithTheirRelations({
      id: ticketId,
      source: true,
    });
    const ticketHistory = await this.findTicketHistoryWithTheirRelations({
      id: ticketId,
      issuedAt: ticket.openedAt,
      planHistory: true,
    });
    const planHistory = await this.planService.findPlanHistoryById(
      ticketHistory.planHistory.id,
    );
    const diff = Math.abs(
      new Date(endDate).getTime() - new Date(ticket.openedAt).getTime(),
    );
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));
    return ticketHistory.amount
      .mul(
        new Decimal(
          ((ticketHistory.planHistory.rate / 100) * diffDays) /
            planHistory.plan.days,
        ),
      )
      .round()
      .toNumber();
  }

  private async findTicketWithTheirRelations({
    id,
    ...relations
  }: FindTicketParams) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: id },
      relations: relations,
    });
    if (!ticket) {
      throw new TicketNotExistException();
    }
    return ticket;
  }

  private async callProcedureSettlementTicket({
    ticketId,
    endDate,
    money,
  }: SettlementTicketParams) {
    await this.dataSource.query(`CALL settlement_ticket($1, $2, $3)`, [
      endDate,
      ticketId,
      money,
    ]);
  }

  async simulateSettlementTicket(ticketId: number, endDate: Date) {
    const interest_money = await this.calculateInterest(ticketId, endDate);
    console.log(interest_money);
    await this.callProcedureSettlementTicket({
      ticketId: ticketId,
      money: interest_money,
      endDate: endDate,
    });
  }

  async settlementTicket(ticketId: number) {
    const now = new Date();
    const interest_money = await this.calculateInterest(ticketId, now);
    await this.callProcedureSettlementTicket({
      ticketId: ticketId,
      money: interest_money,
      endDate: now,
    });
  }
}
