import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { MethodId } from 'src/method/types/method-id.enum';
import { PlanEntity } from 'src/plan/entities/plan.entity';

const methods: Partial<MethodEntity>[] = [
  { id: MethodId.NR },
  { id: MethodId.PR },
  { id: MethodId.PIR },
];

const plans: Partial<PlanEntity>[] = [
  { days: 30 },
  { days: 90 },
  { days: 180 },
];

export default class MethodSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const methodEntities = await dataSource
      .getRepository(MethodEntity)
      .insert(methods);
    const planEntities = await dataSource
      .getRepository(PlanEntity)
      .insert(plans);
  }
}
