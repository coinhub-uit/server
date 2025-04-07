import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { faker } from '@faker-js/faker';

export default class SourceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    const userEntities = await dataSource.getRepository(UserEntity).find();
    const sourceFactory = factoryManager.get(SourceEntity);

    await Promise.all(
      Array.from({ length: 20 }).map(async () => {
        await sourceFactory.save({
          user: faker.helpers.arrayElement(userEntities),
        });
      }),
    );
  }
}
