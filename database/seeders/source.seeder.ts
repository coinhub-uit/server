import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';

export default class SourceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    const userEntities = await dataSource.getRepository(UserEntity).find();
    const sourceRepository = dataSource.getRepository(SourceEntity);
    const sourceFactory = factoryManager.get(SourceEntity);

    await Promise.all(
      Array.from({ length: 20 }).map(async () => {
        await sourceFactory.save({
          user: faker.helpers.arrayElement(userEntities),
        });
      }),
    );

    const predefinedSource = sourceRepository.create({
      balance: new Decimal(90000000),
      id: '00',
      user: {
        id: '00000000-0000-0000-0000-000000000000',
      },
    });
    sourceRepository.save(predefinedSource);
  }
}
