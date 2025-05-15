import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { hash } from 'lib/hashing';

export default class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(AdminEntity);
    await repository.save({
      username: 'admin',
      password: await hash('admin'),
    });
  }
}
