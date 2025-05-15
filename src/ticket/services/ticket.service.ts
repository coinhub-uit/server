import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { dateAfter } from 'lib/date-utils';
import { AvailablePlanView } from 'src/plan/entities/available-plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';
import { SourceEntity } from 'src/source/entities/source.entity';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketHistoryNotExistException } from 'src/ticket/exceptions/ticket-history-not-exist.exception';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private dataSource: DataSource,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const now = new Date();
    const ticketEntity = await this.dataSource.manager.transaction(
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
        const ticketEntity = await ticketRepository.save(ticket);

        const ticketHistory = ticketHistoryRepository.create({
          issuedAt: now,
          maturedAt: dateAfter(now, planHistory.plan!.days),
          principal: createTicketDto.amount,
          interest: (createTicketDto.amount * planHistory.rate) / 100,
          planHistory: planHistory,
          ticket: ticket,
          ticketId: ticket.id,
        });

        await ticketHistoryRepository.save(ticketHistory);
        return ticketEntity;
      },
    );
    return ticketEntity;
  }

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
    return principal
      .mul(diffDays * earlyMaturityInterestRate)
      .div(days)
      .div(100);
  }

  async withdrawTicket(ticketId: number) {
    const settlementDate = new Date();
    await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const ticketHistoryRepository =
          transactionalEntityManager.getRepository(TicketHistoryEntity);
        const ticketRepository =
          transactionalEntityManager.getRepository(TicketEntity);
        const sourceRepository =
          transactionalEntityManager.getRepository(SourceEntity);
        const availablePlanRepository =
          transactionalEntityManager.getRepository(AvailablePlanView);
        const availableNrPlan = await availablePlanRepository.findOne({
          where: {
            days: -1,
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
          latestTicketHistory.ticket!.plan!.days,
          availableNrPlan!.rate,
        );

        const newBalance = latestTicketHistory
          .ticket!.source!.balance.plus(interest)
          .plus(latestTicketHistory.principal);

        latestTicketHistory.maturedAt = settlementDate;
        latestTicketHistory.ticket!.source!.balance = newBalance;
        latestTicketHistory.ticket!.status = TicketStatusEnum.maturedWithdrawn;

        await ticketHistoryRepository.save(latestTicketHistory);
        await sourceRepository.save(latestTicketHistory.ticket!.source!);
        await ticketRepository.save(latestTicketHistory.ticket!);
        await ticketRepository.softRemove(latestTicketHistory.ticket!);
      },
    );
  }

  async simulateMature(ticketId: number) {
    await this.dataSource.query(`CALl simulate_ticket_mature(${ticketId})`);
  }
}
