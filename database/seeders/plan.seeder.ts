import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';

export default class PlanSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(PlanEntity);

    const plans = repository.create([
      {
        id: 1,
        days: -1,
      },
      {
        id: 2,
        days: 30,
      },
      {
        id: 3,
        days: 90,
      },
      {
        id: 4,
        days: 180,
      },
    ]);

    await repository.save(plans);
  }
}
