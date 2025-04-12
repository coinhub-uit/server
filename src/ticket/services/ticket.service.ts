import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { Repository } from 'typeorm';
import { PlanService } from 'src/plan/services/plan.service';
import { SourceEntity } from 'src/source/entities/source.entity';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';

type calculateInterest = {
  rate: number;
  startDate: Date;
  endDate: Date;
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
      ticketHistoryEntity = await this.handleTicket(
        ticketEntity,
        createTicketDto,
      );
    } else {
      //TODO: Handle two remains case
      ticketHistoryEntity = new TicketHistoryEntity();
    }
    return { ticket: ticketEntity, ticketHistory: ticketHistoryEntity };
  }

  private async handleTicket(
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

  private calculateInterest({ rate, startDate, endDate }: calculateInterest) {
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return (rate * diffDays) / 360;
  }

  async settlementTicket(ticketId: number) {
    const ticketEntity = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: {
        source: true,
      },
    });
    const ticketHistory = await this.ticketHistoryRepository.findOne({
      where: { ticketId: ticketId },
      relations: {
        planHistory: true,
      },
    });

    if (!ticketEntity) {
      throw new TicketNotExistException();
    }

    ticketEntity.source.balance = ticketEntity.source.balance.plus(
      this.calculateInterest({
        rate: ticketHistory?.planHistory.rate as number,
        startDate: ticketEntity.openedAt,
        endDate: new Date(),
      }),
    );

    await this.sourceRepository.save(ticketEntity.source);

    await this.ticketRepository.softRemove(ticketEntity);
  }
}
