import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { ViewColumn, ViewEntity, DataSource } from 'typeorm';

@ViewEntity({
  name: 'available_plan',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .distinctOn(['plan.days'])
      .select('plan_history.id', 'id')
      .addSelect('plan_history.definedDate', 'definedDate')
      .addSelect('plan_history.rate', 'rate')
      .addSelect('plan.id', 'planId')
      .from(PlanHistoryEntity, 'plan_history')
      .innerJoin(PlanEntity, 'plan', 'plan.id = plan_history.id')
      .orderBy('plan.days')
      .addOrderBy('plan_history.definedDate', 'DESC'),
})
export class AvailablePlanEntity {
  @ViewColumn()
  id: string;

  @ViewColumn()
  definedDate: Date;

  @ViewColumn()
  rate: number;

  @ViewColumn()
  planId: string;
}
