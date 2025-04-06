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

type MethodEntitiesObject = {
  nr: MethodEntity;
  pir: MethodEntity;
  pr: MethodEntity;
};

const DATE_NOW = Object.freeze(new Date());
const DATE_NOW_START_MONTH = Object.freeze(new Date());
const DATE_PREVIOUS_YEAR = Object.freeze(new Date(new Date().setMonth(-12)));
const MONTH_OF_DATE_NOW = DATE_NOW.getMonth();

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
  { id: 'NR' },
  { id: 'PR' },
  { id: 'PIR' },
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
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[0],
      rate: 1,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[1],
      rate: 1,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[2],
      rate: 3,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[3],
      rate: 3,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-10)),
      plan: planEntities[1],
      rate: 0.8,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-10)),
      plan: planEntities[2],
      rate: 3.2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-10)),
      plan: planEntities[3],
      rate: 3.4,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(9)),
      plan: planEntities[1],
      rate: 1.2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(7)),
      plan: planEntities[1],
      rate: 2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(7)),
      plan: planEntities[2],
      rate: 5,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(7)),
      plan: planEntities[3],
      rate: 5.2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(5)),
      plan: planEntities[1],
      rate: 1,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(5)),
      plan: planEntities[2],
      rate: 2.9,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(5)),
      plan: planEntities[3],
      rate: 2.8,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(2)),
      plan: planEntities[1],
      rate: 1.8,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(2)),
      plan: planEntities[2],
      rate: 4,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(2)),
      plan: planEntities[3],
      rate: 4,
    },
  ]);
}

async function seedTicketAndTicketHistoryNr({
  ticketRepository,
  ticketHistoryRepository,
  sourceEntities,
  methodEntitiesObject,
  planEntities,
  planHistoryEntities,
}: {
  ticketRepository: Repository<TicketEntity>;
  ticketHistoryRepository: Repository<TicketHistoryEntity>;
  sourceEntities: SourceEntity[];
  methodEntitiesObject: MethodEntitiesObject;
  planEntities: PlanEntity[];
  planHistoryEntities: PlanHistoryEntity[];
}) {
  const randomPlanEntity = faker.helpers.arrayElement(planEntities);
  const randomStartDate = faker.date.past({ years: 1 });

  const ticketEntity: TicketEntity = ticketRepository.create({
    source: Promise.resolve(faker.helpers.arrayElement(sourceEntities)),
    method: Promise.resolve(methodEntitiesObject.nr),
    openedDate: randomStartDate,
    ticketHistories: [
      // Promise.resolve([ //1
      ticketHistoryRepository.create({
        amount: randomMoney(),
        issueDate: new Date(randomStartDate),
        // planHistory: Promise.resolve( // Promise later
        planHistory: planHistoryEntities.findLast((planHistoryEntity) => {
          return (
            planHistoryEntity.plan.id === randomPlanEntity.id &&
            planHistoryEntity.definedDate <= randomStartDate
          );
        }),
      }),
      // ]), //1
    ],
  });

  await ticketRepository.save(ticketEntity);
}

export default class MethodSeeder implements Seeder {
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
      nr: methodEntities.find((methodEntity) => methodEntity.id === 'NR')!,
      pr: methodEntities.find((methodEntity) => methodEntity.id === 'PR')!,
      pir: methodEntities.find((methodEntity) => methodEntity.id === 'PIR')!,
    };

    // plan
    const planRepository = dataSource.getRepository(PlanEntity);
    const createdPlanEntities = planRepository.create(PLANS);
    const planEntities = await dataSource
      .getRepository(PlanEntity)
      .save(createdPlanEntities);
    // planEntities.sort((a, b) => a.days - b.days);

    // user
    const userFactory = factoryManager.get(UserEntity);
    const userEntities = await userFactory.saveMany(50);

    // source
    const sourceFactory = factoryManager.get(SourceEntity);
    const sourceEntities = await sourceFactory.saveMany(80, {
      user: Promise.resolve(faker.helpers.arrayElement(userEntities)),
    });

    const planHistoryRepository = dataSource.getRepository(PlanHistoryEntity);
    const planHistoryEntities = await planHistoryRepository.save(
      getPlanHistoryEntities(planHistoryRepository, planEntities),
    );

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
          planHistoryEntities,
        }),
      ),
    );

    // ticket: PR
    {
      const _prMethodEntity = methodEntities.find(
        (methodEntity) => methodEntity.id === 'PR',
      )!;

      const getClosedDate = (
        _startDate: Date,
        numberOfMonths: number,
      ): Date | undefined => {
        if (_startDate.getMonth() + numberOfMonths !== MONTH_OF_DATE_NOW) {
          return;
        }
        const endDate = new Date(_startDate);
        endDate.setMonth(endDate.getMonth() + numberOfMonths);
        return endDate;
      };
    }
  }
}
