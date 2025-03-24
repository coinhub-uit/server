import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SettingEntity } from 'src/setting/entities/setting.entity';

export default class MoneySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(SettingEntity);
    await repository.insert({
      id: 'main',
      minimumInitMoney: 1000000,
    });
  }
}
