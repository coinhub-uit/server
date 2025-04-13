import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { DataSource, Repository } from 'typeorm';
import { PlanService } from 'src/plan/services/plan.service';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';

type SettlementTicketParams = {
  endDate?: Date;
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
    const ticket = await this.ticketRepository.save({
      openedAt: new Date(),
      closedAt: null,
      source: { id: createTicketDto.sourceId },
      method: createTicketDto.method,
    });

    return ticket;
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

  private async calculateInterest(ticketId: number) {
    const ticket = await this.findTicketWithTheirRelations({
      id: ticketId,
      source: true,
    });
    const ticketHistory = await this.ticketHistoryRepository.findOne({
      where: { ticketId: ticketId },
      relations: {
        planHistory: true,
      },
    });

    const diff = Math.abs(new Date().getTime() - ticket.openedAt.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return ((ticketHistory?.planHistory.rate as number) * diffDays) / 360;
  }

  private async findTicketWithTheirRelations(
    findTicketOptions: FindTicketParams,
  ) {
    const { id, ...relations } = findTicketOptions;
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
    try {
      await this.dataSource.query(`CALL process_ticket_closure($1, $2, $3)`, [
        endDate ? endDate : new Date(),
        ticketId,
        money,
      ]);
    } catch {
      throw new TicketNotExistException();
    }
  }

  async simulateSettlementTicket(ticketId: number, endDate: Date) {
    const interest_money = await this.calculateInterest(ticketId);
    await this.callProcedureSettlementTicket({
      ticketId: ticketId,
      money: interest_money,
      endDate: endDate,
    });
  }

  async settlementTicket(ticketId: number) {
    const interest_money = await this.calculateInterest(ticketId);
    await this.callProcedureSettlementTicket({
      ticketId: ticketId,
      money: interest_money,
    });
  }
}
