import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SourceEntity } from 'src/source/entities/source.entity';
import { faker } from '@faker-js/faker/.';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';

const NUMBER_OF_USERS = 50;

const methods: Partial<MethodEntity>[] = [
  { id: 'NR' },
  { id: 'PR' },
  { id: 'PIR' },
];

const plans: Partial<PlanEntity>[] = [
  { days: 30 },
  { days: 90 },
  { days: 180 },
];

export default class MethodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const methodEntities = await dataSource
      .getRepository(MethodEntity)
      .insert(methods);

    const planEntities = (
      await dataSource.getRepository(PlanEntity).insert(plans)
    ).generatedMaps as PlanEntity[];

    const userFactory = factoryManager.get(UserEntity);
    const userEntities = await userFactory.saveMany(NUMBER_OF_USERS);

    const sourceFactory = factoryManager.get(SourceEntity);
    sourceFactory.saveMany(5, {
      user: faker.helpers.arrayElement(userEntities),
    });

    const planHistoryFactory = factoryManager.get(PlanHistoryEntity);
    planHistoryFactory.saveMany(10, {
      plan: faker.helpers.arrayElement(planEntities),
    });
  }
}
