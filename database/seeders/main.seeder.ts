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

type MethodEntitiesObject = {
  nr: MethodEntity;
  pir: MethodEntity;
  pr: MethodEntity;
};

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
  { days: -1 }, // For new Method that has no name yet
  { days: 30 },
  { days: 90 },
  { days: 180 },
];

function getPlanHistoryEntities(
  planHistoryRepository: Repository<PlanHistoryEntity>,
  planEntities: PlanEntity[],
) {
  // FIXME: This is not minus month. Maybe need another lib
  return planHistoryRepository.create([
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve(planEntities[0]),
      rate: 1,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve(planEntities[1]),
      rate: 1,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve(planEntities[2]),
      rate: 3,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 12),
      ),
      plan: Promise.resolve(planEntities[3]),
      rate: 3,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 10),
      ),
      plan: Promise.resolve(planEntities[1]),
      rate: 0.8,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 10),
      ),
      plan: Promise.resolve(planEntities[2]),
      rate: 3.2,
    },
    {
      createdAt: new Date(
        new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 10),
      ),
      plan: Promise.resolve(planEntities[3]),
      rate: 3.4,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 9)),
      plan: Promise.resolve(planEntities[1]),
      rate: 1.2,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 7)),
      plan: Promise.resolve(planEntities[1]),
      rate: 2,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 7)),
      plan: Promise.resolve(planEntities[2]),
      rate: 5,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 7)),
      plan: Promise.resolve(planEntities[3]),
      rate: 5.2,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 5)),
      plan: Promise.resolve(planEntities[1]),
      rate: 1,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 5)),
      plan: Promise.resolve(planEntities[2]),
      rate: 2.9,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 5)),
      plan: Promise.resolve(planEntities[3]),
      rate: 2.8,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 2)),
      plan: Promise.resolve(planEntities[1]),
      rate: 1.8,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 2)),
      plan: Promise.resolve(planEntities[2]),
      rate: 4,
    },
    {
      createdAt: new Date(new Date(DATE_NOW).setMonth(DATE_NOW.getMonth() - 2)),
      plan: Promise.resolve(planEntities[3]),
      rate: 4,
    },
  ]);
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
  methodEntitiesObject,
  planEntities,
  reversedPlanHistoryEntities,
}: {
  ticketRepository: Repository<TicketEntity>;
  ticketHistoryRepository: Repository<TicketHistoryEntity>;
  sourceEntities: SourceEntity[];
  methodEntitiesObject: MethodEntitiesObject;
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
    method: Promise.resolve(methodEntitiesObject.nr),
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
  methodEntitiesObject,
  planEntities,
  reversedPlanHistoryEntities,
  methodType,
}: {
  ticketRepository: Repository<TicketEntity>;
  ticketHistoryRepository: Repository<TicketHistoryEntity>;
  sourceEntities: SourceEntity[];
  methodEntitiesObject: MethodEntitiesObject;
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
    method: Promise.resolve(methodEntitiesObject.nr),
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
    const methodEntities = await dataSource
      .getRepository(MethodEntity)
      .save(createdMethodEntities);

    const methodEntitiesObject: MethodEntitiesObject = {
      nr: methodEntities.find(
        (methodEntity) => methodEntity.id === MethodEnum.NR,
      )!,
      pr: methodEntities.find(
        (methodEntity) => methodEntity.id === MethodEnum.PR,
      )!,
      pir: methodEntities.find(
        (methodEntity) => methodEntity.id === MethodEnum.PIR,
      )!,
    };

    // plan
    const planRepository = dataSource.getRepository(PlanEntity);
    const createdPlanEntities = planRepository.create(PLANS);
    const planEntities = await dataSource
      .getRepository(PlanEntity)
      .save(createdPlanEntities);
    planEntities.sort((a, b) => a.days - b.days); // NOTE: Do we really need to sort? does typeorm ensure the order

    // planHistory
    const planHistoryRepository = dataSource.getRepository(PlanHistoryEntity);
    const planHistoryEntities = await planHistoryRepository.save(
      getPlanHistoryEntities(planHistoryRepository, planEntities),
    );
    const reversedPlanHistoryEntities = [...planHistoryEntities].reverse();

    // user
    const userFactory = factoryManager.get(UserEntity);
    const userEntities = await userFactory.saveMany(50);

    // source
    const sourceFactory = factoryManager.get(SourceEntity);
    const sourceEntities = await sourceFactory.saveMany(80, {
      user: Promise.resolve(faker.helpers.arrayElement(userEntities)),
    });

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
          methodEntitiesObject,
          planEntities,
          reversedPlanHistoryEntities,
        }),
      ),
    );

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        seedTicketAndTicketHistoryPrOrPir({
          ticketRepository,
          ticketHistoryRepository,
          sourceEntities,
          methodEntitiesObject,
          planEntities,
          reversedPlanHistoryEntities,
          methodType: MethodEnum.PR,
        }),
      ),
    );

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        seedTicketAndTicketHistoryPrOrPir({
          ticketRepository,
          ticketHistoryRepository,
          sourceEntities,
          methodEntitiesObject,
          planEntities,
          reversedPlanHistoryEntities,
          methodType: MethodEnum.PIR,
        }),
      ),
    );
  }
}
