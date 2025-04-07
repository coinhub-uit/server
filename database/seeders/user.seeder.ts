import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

export default class UserSeeder implements Seeder {
  public async run(_: DataSource, factoryManager: SeederFactoryManager) {
    const userFactory = factoryManager.get(UserEntity);
    return await userFactory.saveMany(50);
  }
}
