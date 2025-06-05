import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    const userRepository = datasource.getRepository(UserEntity);
    const userFactory = factoryManager.get(UserEntity);
    await userFactory.saveMany(50);

    const predefinedUser = userRepository.create({
      id: '00000000-0000-0000-0000-000000000000',
      address: 'Vuon khong nha trong',
      avatar: 'https://avatars.githubusercontent.com/u/86353526?v=4',
      birthDate: new Date(2005, 8, 24),
      citizenId: '078123456000',
      fullName: 'Kevin Nitro',
    });
    userRepository.save(predefinedUser);
  }
}
