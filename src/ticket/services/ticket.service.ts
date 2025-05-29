import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { dateAfter } from 'lib/date-utils';
import { AvailablePlanView } from 'src/plan/entities/available-plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { PlanHistoryNotExistException } from 'src/plan/exceptions/plan-history-not-exist';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceNotExistException } from 'src/source/exceptions/source-not-exist.execeptions';
import { CreateTicketDto } from 'src/ticket/dtos/create-ticket.dto';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { NotAllowedToCreateTicketFromOtherSourceException } from 'src/ticket/exceptions/not-allowed-to-create-ticket-from-other-source.exception';
import { TicketHistoryNotExistException } from 'src/ticket/exceptions/ticket-history-not-exist.exception';
import { TicketNotExistException } from 'src/ticket/exceptions/ticket-not-exist.exception';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    private dataSource: DataSource,
  ) {}

  async getById(ticketId: number, userIdOrIsAdmin: string | true) {
    const ticketEntity = this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const ticketRepository =
          transactionalEntityManager.getRepository(TicketEntity);
        const ticket = await ticketRepository.findOne({
          where: {
            id: ticketId,
          },
          relations: {
            source: {
              user: true,
            },
          },
        });

        if (!ticket) {
          throw new TicketNotExistException('Ticket not exist');
        }
        if (
          userIdOrIsAdmin !== true &&
          ticket.source!.user!.id !== userIdOrIsAdmin
        ) {
          throw new NotAllowedToCreateTicketFromOtherSourceException(
            ticket.source!.user!.id,
          );
        }
        return ticket;
      },
    );

    return ticketEntity;
  }

  async createTicket(
    createTicketDto: CreateTicketDto,
    userIdOrIsAdmin: string | true,
  ) {
    const now = new Date();
    const ticketEntity = await this.dataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const ticketRepository =
          transactionalEntityManager.getRepository(TicketEntity);
        const ticketHistoryRepository =
          transactionalEntityManager.getRepository(TicketHistoryEntity);
        const planHistoryRepository =
          transactionalEntityManager.getRepository(PlanHistoryEntity);
        const sourceRepository =
          transactionalEntityManager.getRepository(SourceEntity);

        // TODO: Skip if it's admin (checking owner)
        const source = await sourceRepository.findOne({
          where: {
            id: createTicketDto.sourceId,
          },
          relations: {
            user: true,
          },
        });

        if (!source) {
          throw new SourceNotExistException(createTicketDto.sourceId);
        }

        if (userIdOrIsAdmin !== true && source.user!.id !== userIdOrIsAdmin) {
          throw new NotAllowedToCreateTicketFromOtherSourceException(
            createTicketDto.sourceId,
          );
        }

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
          maturedAt:
            planHistory.plan!.days != -1
              ? dateAfter(now, planHistory.plan!.days)
              : undefined,
          principal: createTicketDto.amount,
          interest: (createTicketDto.amount * planHistory.rate) / 100,
          planHistory: planHistory,
          ticket: ticket,
          ticketId: ticket.id,
        });

        // NOTE: we believe front end has check this condition
        source.balance = source.balance.minus(createTicketDto.amount);
        await sourceRepository.save(source);

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
          latestTicketHistory.ticket!.plan.days,
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
