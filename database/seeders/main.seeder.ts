import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketHistoryEntity } from 'src/ticket/entities/ticket-history.entity';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';
import { MethodEnum } from 'src/method/types/method.enum';

const DATE_NOW = Object.freeze(new Date());

function randomMoney() {
  return Decimal(
    faker.finance.amount({
      min: 0,
      max: 99999999,
      dec: 0,
    }),
  );
}

const METHODS: DeepPartial<MethodEntity>[] = [
  { id: MethodEnum.NR },
  { id: MethodEnum.PR },
  { id: MethodEnum.PIR },
];

const PLANS: DeepPartial<PlanEntity>[] = [
  { days: -1 },
  { days: 30 },
  { days: 90 },
  { days: 180 },
];

async function seedPlanHistories(
  planHistoryRepository: Repository<PlanHistoryEntity>,
): Promise<PlanHistoryEntity[]> {
  const planHistories = planHistoryRepository.create([
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 18),
      ),
      plan: Promise.resolve({ id: 1 }),
      rate: 2,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 18),
      ),
      plan: Promise.resolve({ id: 2 }),
      rate: 3,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 18),
      ),
      plan: Promise.resolve({ id: 3 }),
      rate: 3.2,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 18),
      ),
      plan: Promise.resolve({ id: 4 }),
      rate: 3.2,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 17),
      ),
      plan: Promise.resolve({ id: 2 }),
      rate: 4,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 15),
      ),
      plan: Promise.resolve({ id: 3 }),
      rate: 4,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 15),
      ),
      plan: Promise.resolve({ id: 4 }),
      rate: 4,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 15),
      ),
      plan: Promise.resolve({ id: 1 }),
      rate: 1,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 14),
      ),
      plan: Promise.resolve({ id: 2 }),
      rate: 2.3,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 13),
      ),
      plan: Promise.resolve({ id: 3 }),
      rate: 2.4,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 13),
      ),
      plan: Promise.resolve({ id: 4 }),
      rate: 2.4,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve({ id: 1 }),
      rate: 1,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve({ id: 2 }),
      rate: 1,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve({ id: 3 }),
      rate: 3,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve({ id: 4 }),
      rate: 3,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 10),
      ),
      plan: Promise.resolve({ id: 2 }),
      rate: 0.8,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 10),
      ),
      plan: Promise.resolve({ id: 3 }),
      rate: 3.2,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 10),
      ),
      plan: Promise.resolve({ id: 4 }),
      rate: 3.4,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 9)),
      plan: Promise.resolve({ id: 2 }),
      rate: 1.2,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 7)),
      plan: Promise.resolve({ id: 2 }),
      rate: 2,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 7)),
      plan: Promise.resolve({ id: 3 }),
      rate: 5,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 7)),
      plan: Promise.resolve({ id: 4 }),
      rate: 5.2,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 5)),
      plan: Promise.resolve({ id: 2 }),
      rate: 1,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 5)),
      plan: Promise.resolve({ id: 3 }),
      rate: 2.9,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 5)),
      plan: Promise.resolve({ id: 4 }),
      rate: 2.8,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 2)),
      plan: Promise.resolve({ id: 2 }),
      rate: 1.8,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 2)),
      plan: Promise.resolve({ id: 3 }),
      rate: 4,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 2)),
      plan: Promise.resolve({ id: 4 }),
      rate: 4,
    },
  ]);

  const planHistoryEntities = await planHistoryRepository.save(planHistories);
  return planHistoryEntities;
}

// https://stackoverflow.com/a/63795192/23173098
async function findAsyncSequential<T>(
  array: T[],
  predicate: (t: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (const t of array) {
    if (await predicate(t)) {
      return t;
    }
  }
}

// PERF: The planHistoryEntities is iterated awaiting to get the plan. Maybe try closure
async function seedTicketAndTicketHistoryNr({
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
  const randomPlanEntity = faker.helpers.arrayElement(planEntities);
  const randomStartDate = faker.date.past({ years: 1 });
  const endDateFromRandomStartDate = new Date(
    new Date().setDate(randomStartDate.getDate() + randomPlanEntity.days),
  );

  const ticketEntity: TicketEntity = ticketRepository.create({
    source: Promise.resolve(faker.helpers.arrayElement(sourceEntities)),
    method: Promise.resolve({ id: MethodEnum.NR }),
    openedAt: randomStartDate,
    closedAt: endDateFromRandomStartDate,
  });

  const ticketHistoryEntity: TicketHistoryEntity =
    ticketHistoryRepository.create({
      amount: randomMoney(),
      issuedAt: new Date(randomStartDate),
      planHistory: Promise.resolve(
        findAsyncSequential(
          reversedPlanHistoryEntities,
          async (planHistoryEntity) => {
            return (
              (await planHistoryEntity.plan).id === randomPlanEntity.id &&
              planHistoryEntity.createdAt <= randomStartDate
            );
          },
        ),
      ),
      maturedAt: endDateFromRandomStartDate,
      ticket: Promise.resolve(ticketEntity),
    });

  await ticketRepository.save(ticketEntity);
  await ticketHistoryRepository.save(ticketHistoryEntity);
}

async function seedTicketAndTicketHistoryPrOrPir({
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
  const randomPlanEntity = faker.helpers.arrayElement(planEntities);
  const iterateDate = faker.date.past({ years: 1 });
  const numberOfMonths = faker.number.int({ min: 1, max: 20 });
  const maturedDate: Date = new Date(
    new Date().setDate(iterateDate.getDate() + randomPlanEntity.days + 1),
  );
  const ticketHistoryEntities: TicketHistoryEntity[] = [];
  let existingAmount = randomMoney();

  const ticketEntity: TicketEntity = ticketRepository.create({
    source: Promise.resolve(faker.helpers.arrayElement(sourceEntities)),
    method: Promise.resolve(methodType),
    openedAt: new Date(iterateDate),
  });

  for (let i = 1; i <= numberOfMonths; ++i) {
    const existingPlanHistoryEntity = await findAsyncSequential(
      reversedPlanHistoryEntities,
      async (planHistoryEntity) => {
        return (
          (await planHistoryEntity.plan).id === randomPlanEntity.id &&
          planHistoryEntity.createdAt <= iterateDate
        );
      },
    );

    if (existingPlanHistoryEntity === undefined) {
      return;
    }

    const ticketHistoryEntity = ticketHistoryRepository.create({
      amount: existingAmount,
      issuedAt: new Date(iterateDate),
      planHistory: Promise.resolve(existingPlanHistoryEntity),
      maturedAt: new Date(maturedDate),
      ticket: Promise.resolve(ticketEntity),
    });

    ticketHistoryEntities.push(ticketHistoryEntity);

    if (maturedDate > DATE_NOW) {
      ticketEntity.closedAt = new Date(maturedDate);
      break;
    }

    if (methodType === MethodEnum.PIR) {
      existingAmount = existingAmount.plus(
        existingAmount.mul(
          (existingPlanHistoryEntity.rate * randomPlanEntity.days) / 365, // PERF: refactor this to increase but nonsense
        ),
      );
    }

    iterateDate.setDate(maturedDate.getDate());
    maturedDate.setDate(iterateDate.getDate() + randomPlanEntity.days + 1);
  }

  await ticketRepository.save(ticketEntity);
  await ticketHistoryRepository.save(ticketHistoryEntities);
}

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // method
    const methodRepository = dataSource.getRepository(MethodEntity);
    const createdMethodEntities = methodRepository.create(METHODS);
    await methodRepository.save(createdMethodEntities);

    console.log('Seeded methods');

    // plan
    const planRepository = dataSource.getRepository(PlanEntity);
    // TODO: refactor this out a function
    const planEntities = await planRepository.save(
      planRepository.create(PLANS),
    );
    console.log('Seeded plans');

    // planHistory
    const planHistoryRepository = dataSource.getRepository(PlanHistoryEntity);
    const planHistoryEntities = await seedPlanHistories(planHistoryRepository);
    console.log('Seeded plan histories');
    const reversedPlanHistoryEntities = [...planHistoryEntities].reverse();

    // user
    const userFactory = factoryManager.get(UserEntity);
    const userEntities = await userFactory.saveMany(50);
    console.log('Seeded users');

    // source
    const sourceFactory = factoryManager.get(SourceEntity);
    const sourceEntities = await sourceFactory.saveMany(80, {
      user: Promise.resolve(faker.helpers.arrayElement(userEntities)),
    });
    console.log('Seeded sources');

    // ticket
    const ticketRepository = dataSource.getRepository(TicketEntity);
    const ticketHistoryRepository =
      dataSource.getRepository(TicketHistoryEntity);

    // ticket: NR

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        seedTicketAndTicketHistoryNr({
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
        seedTicketAndTicketHistoryPrOrPir({
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
        seedTicketAndTicketHistoryPrOrPir({
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
