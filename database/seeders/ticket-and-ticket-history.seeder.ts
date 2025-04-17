import { Seeder } from 'typeorm-extension';
import { DataSource, Repository } from 'typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { faker } from '@faker-js/faker';
import { randomMoney } from 'lib/random-money';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { MethodEnum } from 'src/ticket/types/method.enum';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketStatusEnum } from 'src/ticket/types/ticket-status.enum';

// PERF: The planHistoryEntities is iterated awaiting to get the plan. Maybe try closure
export default class TicketAndTicketHistorySeeder implements Seeder {
  private DATE_NOW = Object.freeze(new Date());

  private async seedNr({
    ticketRepository,
    ticketHistoryRepository,
    sourceEntities,
    planEntities,
    reversedPlanHistoryEntities,
  }: {
    ticketRepository: Repository<TicketEntity>;
    ticketHistoryRepository: Repository<TicketHistoryEntity>;
    sourceEntities: SourceEntity[];
    planEntities: PlanEntity[];
    reversedPlanHistoryEntities: PlanHistoryEntity[];
  }) {
    const randomPlanEntity = faker.helpers.arrayElement(
      planEntities.filter((planEntity) => planEntity.days !== -1),
    );
    const randomStartDate = faker.date.past({ years: 1 });
    const endDateFromRandomStartDate = new Date(
      new Date().setDate(randomStartDate.getDate() + randomPlanEntity.days),
    );

    const ticketEntity = await ticketRepository.save(
      ticketRepository.create({
        source: faker.helpers.arrayElement(sourceEntities),
        method: MethodEnum.NR,
        openedAt: randomStartDate,
        closedAt: endDateFromRandomStartDate,
        status:
          endDateFromRandomStartDate <= this.DATE_NOW
            ? TicketStatusEnum.maturedWithdrawn
            : TicketStatusEnum.active,
        plan: randomPlanEntity,
      }),
    );

    const shouldWithdraw = this.shouldWithdraw;

    const ticketHistoryEntity: TicketHistoryEntity =
      ticketHistoryRepository.create({
        amount: randomMoney(),
        issuedAt: new Date(randomStartDate),
        planHistory: reversedPlanHistoryEntities.find((planHistoryEntity) => {
          return shouldWithdraw
            ? planHistoryEntity.plan!.days === -1
            : planHistoryEntity.plan!.id === randomPlanEntity.id &&
                planHistoryEntity.createdAt <= randomStartDate;
        }),
        maturedAt: endDateFromRandomStartDate,
        ticket: ticketEntity,
      });

    if (shouldWithdraw) {
      const randomWithdrawDate = new Date(randomStartDate);
      randomWithdrawDate.setDate(
        randomWithdrawDate.getDate() +
          faker.number.int({ min: 1, max: randomPlanEntity.days }),
      );
      ticketEntity.closedAt = randomWithdrawDate;
      ticketEntity.status = TicketStatusEnum.earlyWithdrawn;
      await ticketRepository.save(ticketEntity);
    }

    await ticketHistoryRepository.save(ticketHistoryEntity);
  }

  private async seedPrOrPir({
    ticketRepository,
    ticketHistoryRepository,
    sourceEntities,
    planEntities,
    reversedPlanHistoryEntities,
    methodType,
  }: {
    ticketRepository: Repository<TicketEntity>;
    ticketHistoryRepository: Repository<TicketHistoryEntity>;
    sourceEntities: SourceEntity[];
    planEntities: PlanEntity[];
    reversedPlanHistoryEntities: PlanHistoryEntity[];
    methodType: Exclude<MethodEnum, MethodEnum.NR>;
  }) {
    const randomPlanEntity = faker.helpers.arrayElement(
      planEntities.filter((planEntity) => planEntity.days !== -1),
    );
    let iterateDate = faker.date.past({ years: 1 });
    const numberOfMonths = faker.number.int({ min: 1, max: 20 });
    const maturedDate: Date = new Date(
      new Date(iterateDate).setDate(
        iterateDate.getDate() + randomPlanEntity.days + 1,
      ),
    );
    let existingAmount = randomMoney();
    const ticketHistoryEntities: TicketHistoryEntity[] = [];

    const firstTicketEntity: TicketEntity = ticketRepository.create({
      source: faker.helpers.arrayElement(sourceEntities),
      method: methodType,
      openedAt: new Date(iterateDate),
      plan: randomPlanEntity,
    });
    const secondTicketEntity = await ticketRepository.save(firstTicketEntity);

    for (let i = 1; i <= numberOfMonths; ++i) {
      const existingPlanHistoryEntity = reversedPlanHistoryEntities.find(
        (planHistoryEntity) =>
          planHistoryEntity.plan!.id === randomPlanEntity.id &&
          planHistoryEntity.createdAt <= iterateDate,
      );

      if (existingPlanHistoryEntity === undefined) {
        console.log('Oops cannot find existing plan history'); // yeah never
        return;
      }

      const ticketHistoryEntity = ticketHistoryRepository.create({
        amount: existingAmount,
        issuedAt: new Date(iterateDate),
        planHistory: existingPlanHistoryEntity,
        maturedAt: new Date(maturedDate),
        ticketId: secondTicketEntity.id,
      });

      ticketHistoryEntities.push(ticketHistoryEntity);

      if (this.shouldWithdraw) {
        const randomWithdrawDate = new Date(iterateDate);
        randomWithdrawDate.setDate(
          randomWithdrawDate.getDate() +
            faker.number.int({ min: 1, max: randomPlanEntity.days }),
        );
        secondTicketEntity.closedAt = randomWithdrawDate;
        secondTicketEntity.status = TicketStatusEnum.earlyWithdrawn;
        break;
      }

      if (maturedDate > this.DATE_NOW) {
        secondTicketEntity.closedAt = new Date(maturedDate);
        secondTicketEntity.status = TicketStatusEnum.maturedWithdrawn;
        break;
      }

      if (methodType === MethodEnum.PIR) {
        existingAmount = existingAmount.plus(
          existingAmount.mul(
            (existingPlanHistoryEntity.rate * randomPlanEntity.days) / 365, // PERF: refactor this to increase but nonsense
          ),
        );
      }

      iterateDate = new Date(maturedDate);
      maturedDate.setDate(maturedDate.getDate() + randomPlanEntity.days + 1);
    }

    await ticketRepository.save(secondTicketEntity);
    await ticketHistoryRepository.save(ticketHistoryEntities);
  }

  private get shouldWithdraw() {
    return faker.number.int({ min: 1, max: 100 }) <= 20;
  }

  public async run(dataSource: DataSource) {
    const ticketRepository = dataSource.getRepository(TicketEntity);
    const ticketHistoryRepository =
      dataSource.getRepository(TicketHistoryEntity);
    const sourceRepository = dataSource.getRepository(SourceEntity);
    const planRepository = dataSource.getRepository(PlanEntity);
    const planHistoryRepository = dataSource.getRepository(PlanHistoryEntity);

    const sourceEntities = await sourceRepository.find();
    const planEntities = await planRepository.find();
    const planHistoryEntities = await planHistoryRepository.find({
      relations: { plan: true },
    });
    const reversedPlanHistoryEntities = [...planHistoryEntities].reverse();

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        this.seedNr({
          ticketRepository,
          ticketHistoryRepository,
          sourceEntities,
          planEntities,
          reversedPlanHistoryEntities,
        }),
      ),
    );
    console.log('Seeded tickets (NR)');

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        this.seedPrOrPir({
          ticketRepository,
          ticketHistoryRepository,
          sourceEntities,
          planEntities,
          reversedPlanHistoryEntities,
          methodType: MethodEnum.PR,
        }),
      ),
    );
    console.log('Seeded tickets (PR)');

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        this.seedPrOrPir({
          ticketRepository,
          ticketHistoryRepository,
          sourceEntities,
          planEntities,
          reversedPlanHistoryEntities,
          methodType: MethodEnum.PIR,
        }),
      ),
    );
    console.log('Seeded tickets (PIR)');
  }
}
