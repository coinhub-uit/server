import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { hash } from 'src/common/utils/hashing';

export default class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(AdminEntity);
    await repository.insert({
      username: 'admin',
      password: await hash('password'),
    });
  }
}
