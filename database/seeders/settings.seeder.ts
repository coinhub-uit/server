import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SettingsEntity } from 'src/setting/entities/settings.entity';

export default class SettingsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(SettingsEntity);
    await repository.insert({
      minAmountOpenTicket: 1000000,
    });
  }
}
