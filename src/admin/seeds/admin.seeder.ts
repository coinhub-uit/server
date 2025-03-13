import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(AdminEntity);
    await repository.insert({
      username: 'admin',
      password: 'password',
    });
  }
}
