import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { TicketEntity } from 'src/ticket/entities/ticket.entity';
import { TicketPlanHistoryEntity } from 'src/ticket/entities/ticket-plan-history.entity';
import { faker } from '@faker-js/faker';

// function seedTicketsPrMethod(nrEntity: MethodEntity, ticketFactory: SeederFactory<TicketEntity>){
//
// }

const DATE_NOW = Object.freeze(new Date());
const DATE_PREVIOUS_YEAR = Object.freeze(new Date(new Date().setMonth(-12)));
const PREVIOUS_YEAR = DATE_PREVIOUS_YEAR.getFullYear();
const MONTH_OF_DATE_NOW = DATE_NOW.getMonth();

function getPlanHistoryEntities(
  planEntities: PlanEntity[],
): Partial<PlanHistoryEntity>[] {
  return [
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[0],
      rate: 1,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[1],
      rate: 3,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-12)),
      plan: planEntities[2],
      rate: 3,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-10)),
      plan: planEntities[0],
      rate: 0.8,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-10)),
      plan: planEntities[1],
      rate: 3.2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(-10)),
      plan: planEntities[2],
      rate: 3.4,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(9)),
      plan: planEntities[0],
      rate: 1.2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(7)),
      plan: planEntities[0],
      rate: 2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(7)),
      plan: planEntities[1],
      rate: 5,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(7)),
      plan: planEntities[2],
      rate: 5.2,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(5)),
      plan: planEntities[0],
      rate: 1,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(5)),
      plan: planEntities[1],
      rate: 2.9,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(5)),
      plan: planEntities[2],
      rate: 2.8,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(2)),
      plan: planEntities[0],
      rate: 1.8,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(2)),
      plan: planEntities[1],
      rate: 4,
    },
    {
      definedDate: new Date(new Date(DATE_NOW).setMonth(2)),
      plan: planEntities[2],
      rate: 4,
    },
  ];
}

export default class MethodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // method
    const methodEntities = (
      await dataSource
        .getRepository(MethodEntity)
        .insert([{ id: 'NR' }, { id: 'PR' }, { id: 'PIR' }])
    ).generatedMaps as MethodEntity[];
    // const nrMethodEntity = methodEntities.find(
    //   (methodEntity) => methodEntity.id === 'NR',
    // )!;
    // const prMethodEntity = methodEntities.find(
    //   (methodEntity) => methodEntity.id === 'PR',
    // )!;
    // const pirMethodEntity = methodEntities.find(
    //   (methodEntity) => methodEntity.id === 'PIR',
    // )!;

    // plan
    const planEntities = (
      await dataSource
        .getRepository(PlanEntity)
        .insert([{ days: 30 }, { days: 90 }, { days: 180 }])
    ).generatedMaps as PlanEntity[];
    planEntities.sort((a, b) => a.days - b.days);

    // user
    const userFactory = factoryManager.get(UserEntity);
    const userEntities = await userFactory.saveMany(50);

    // source
    const sourceFactory = factoryManager.get(SourceEntity);
    const sourceEntities = await sourceFactory.saveMany(5, {
      user: faker.helpers.arrayElement(userEntities),
    });

    // plan_history
    const planHistoryFactory = factoryManager.get(PlanHistoryEntity);
    // const _planHistoryEntitiesMayDup = await planHistoryFactory.make({
    //   plan: faker.helpers.arrayElement(planEntities),
    // });
    // const planHistoryEntities = (
    //   await dataSource
    //     .getRepository(PlanHistoryEntity)
    //     .upsert(_planHistoryEntitiesMayDup, {
    //       conflictPaths: {
    //         definedDate: true,
    //       },
    //     })
    // ).generatedMaps as PlanHistoryEntity[];
    // planHistoryEntities.sort((a, b) =>
    //   a.definedDate < b.definedDate ? -1 : 1,
    // );

    // ticket_plan_history
    const ticketPlanHistoryRepository = dataSource.getRepository(
      TicketPlanHistoryEntity,
    );

    // ticket
    const ticketFactory = factoryManager.get(TicketEntity);
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

      await Promise.all(
        Array(10)
          .fill(true)
          .map(async () => {
            const _randomSourceEntity =
              faker.helpers.arrayElement(sourceEntities);
            const _startDate = faker.date.past({ years: 2 });
            const _numberOfMonths = faker.number.int({
              min: 1,
              max: MONTH_OF_DATE_NOW - _startDate.getMonth(),
            });

            const _ticketEntity = await ticketFactory.save({
              method: _prMethodEntity,
              source: _randomSourceEntity,
              createdAt: _startDate,
              closedDate: getClosedDate(_startDate, _numberOfMonths),
            });

            for (let _month = 0; _month < _numberOfMonths; ++_month) {
              _startDate.setMonth(_startDate.getMonth() + 1);
              const _endCurrentIterateDate = new Date(_startDate);
              _endCurrentIterateDate.setd;
              ticketPlanHistoryRepository.insert({
                ticket: _ticketEntity,
              });
            }
          }),
      );
    }
    // ticket: PR
  }
}
