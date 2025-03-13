import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan_history.entity';
import { ViewColumn, ViewEntity, DataSource } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('plan_history.id', 'id')
      .addSelect('MAX(plan_history.definedDate)', 'definedDate')
      .addSelect('plan_history.rate', 'rate')
      .addSelect('plan.id', 'planId')
      .from(PlanHistoryEntity, 'plan_history')
      .innerJoin(PlanEntity, 'plan', 'plan.id = plan_history.id')
      .groupBy('plan.days'),
})
export class AvailablePlanEntity {
  @ViewColumn()
  id: string;

  @ViewColumn()
  rate: number;

  @ViewColumn()
  planId: string;
}
