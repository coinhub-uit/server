import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TicketHistoryNotExistException } from 'src/ticket/exceptions/ticket-history-not-exist.exception';
import { SourceEntity } from 'src/source/entities/source.entity';
import { dateAfter } from 'lib/date-utils';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';
import Decimal from 'decimal.js';

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
    const now = new Date();
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const ticketRepository =
          transactionalEntityManager.getRepository(TicketEntity);
        const ticketHistoryRepository =
          transactionalEntityManager.getRepository(TicketHistoryEntity);
        const planHistoryRepository =
          transactionalEntityManager.getRepository(PlanHistoryEntity);

        const planHistory = await planHistoryRepository.findOne({
          where: { id: createTicketDto.planHistoryId },
          relations: {
            plan: true,
          },
        });

        if (!planHistory) {
          throw new PlanHistoryNotExistException(createTicketDto.planHistoryId);
        }
        const ticket = ticketRepository.create({
          openedAt: now,
          status: TicketStatusEnum.active,
          method: createTicketDto.method,
          source: { id: createTicketDto.sourceId },
          plan: planHistory.plan,
        });
        await ticketRepository.save(ticket);

        const ticketHistory = ticketHistoryRepository.create({
          issuedAt: now,
          maturedAt: dateAfter(now, planHistory.plan.days),
          principal: createTicketDto.amount,
          interest: createTicketDto.amount * planHistory.rate,
          planHistory: planHistory,
          ticket: ticket,
          ticketId: ticket.id,
        });

        return await ticketHistoryRepository.save(ticketHistory);
      },
    );
  }

  // static calcInterest({
  //   ticketHistoryIssuedAt,
  //   now,
  //   planDays,
  //   rate,
  // }: {
  //   ticketHistoryIssuedAt: Date;
  //   now: Date;
  //   planDays: number;
  //   rate: number;
  // }) {
  //   const diffDays = Math.ceil(
  //     Math.abs(now.getTime() - ticketHistoryIssuedAt.getTime()) /
  //       (1000 * 3600 * 24),
  //   );
  //   return ticketHistoryEntity.interest.mul(diffDays).div(planDays);
  // }

  static calculateEarlyInterest(
    issuedDate: Date,
    principal: Decimal,
    settlementDate: Date,
    days: number,
    earlyMaturityInterestRate: number,
  ) {
    const diffDays = Math.ceil(
      Math.abs(settlementDate.getTime() - issuedDate.getTime()) /
        (1000 * 3600 * 24),
    );
    return principal.mul(diffDays * earlyMaturityInterestRate).div(days);
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
        const planHistoryRepository =
          transactionalEntityManager.getRepository(PlanHistoryEntity);

        const latestNrPlanHistory = await planHistoryRepository.findOne({
          order: {
            createdAt: 'DESC',
            plan: {
              days: -1,
            },
          },
        });
        const latestTicketHistory = await ticketHistoryRepository.findOne({
          where: { ticketId },
          order: {
            issuedAt: 'DESC',
          },
          relations: {
            ticket: { source: true, plan: true },
          },
        });
        if (!latestTicketHistory) {
          throw new TicketHistoryNotExistException();
        }

        const interest = TicketService.calculateEarlyInterest(
          latestTicketHistory.issuedAt,
          latestTicketHistory.principal,
          settlementDate,
          latestTicketHistory.ticket.plan.days,
          latestNrPlanHistory!.rate,
        );

        const newBalance = latestTicketHistory.ticket.source.balance
          .plus(interest)
          .plus(latestTicketHistory.principal);

        latestTicketHistory.maturedAt = settlementDate;
        latestTicketHistory.ticket.source.balance = newBalance;

        await ticketHistoryRepository.save(latestTicketHistory);
        await sourceRepository.save(latestTicketHistory.ticket.source);
        await ticketRepository.softRemove(latestTicketHistory.ticket);
      },
    );
  }

  async simulateMaturityCircle(ticketId: number) {
    await this.dataSource.query(`CALl simulate_maturity_circle(${ticketId})`);
  }
}
