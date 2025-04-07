import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';

export default class PlanSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(PlanEntity);

    const plans = repository.create([
      { days: -1 },
      { days: 30 },
      { days: 90 },
      { days: 180 },
    ]);

    await repository.insert(plans);
  }
}
