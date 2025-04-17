import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TicketHistoryNotExistException } from 'src/ticket/exceptions/ticket-history-not-exist.exception';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { SourceEntity } from 'src/source/entities/source.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(TicketHistoryEntity)
    private readonly ticketHistoryRepository: Repository<TicketHistoryEntity>,
    private dataSource: DataSource,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const ticket = this.ticketRepository.create({
      source: { id: createTicketDto.sourceId },
      method: createTicketDto.method,
    });
    return await this.ticketRepository.save(ticket);
  }

  private calcInterest(
    ticketHistoryEntity: TicketHistoryEntity,
    settlementDate: Date,
    plan: PlanEntity,
  ) {
    const diffDays = Math.ceil(
      Math.abs(
        settlementDate.getTime() - ticketHistoryEntity.issuedAt.getTime(),
      ) /
        (1000 * 3600 * 24),
    );
    return ticketHistoryEntity.maturedInterest.mul(diffDays).div(plan.days);
  }

  async settlementTicket(ticketId: number) {
    const settlementDate = new Date();
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const ticketHistoryRepository =
          transactionalEntityManager.getRepository(TicketHistoryEntity);
        const ticketRepository =
          transactionalEntityManager.getRepository(TicketEntity);
        const sourceRepository =
          transactionalEntityManager.getRepository(SourceEntity);

        const latestTicketHistory = await ticketHistoryRepository.findOne({
          where: { ticketId },
          order: {
            issuedAt: { direction: 'DESC' },
          },
          relations: {
            ticket: { source: true, plan: true },
          },
        });
        if (!latestTicketHistory) {
          throw new TicketHistoryNotExistException();
        }

        const interest = this.calcInterest(
          latestTicketHistory,
          settlementDate,
          latestTicketHistory.ticket.plan,
        );
        const newBalance = latestTicketHistory.ticket.source.balance
          .plus(interest)
          .plus(latestTicketHistory.amount);

        latestTicketHistory.maturedAt = settlementDate;
        latestTicketHistory.ticket.source.balance = newBalance;

        await ticketHistoryRepository.save(latestTicketHistory);
        await sourceRepository.save(latestTicketHistory.ticket.source);
        await ticketRepository.softRemove(latestTicketHistory.ticket);
      },
    );
  }
}
