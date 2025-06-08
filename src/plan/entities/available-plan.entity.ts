import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { ViewColumn, ViewEntity, DataSource } from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
@ViewEntity({
  name: 'available_plan',
  materialized: true,
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .distinctOn(['plan.days'])
      .select('plan_history.id', 'planHistoryId')
      .addSelect('plan_history.rate', 'rate')
      .addSelect('plan.id', 'planId')
      .addSelect('plan.days', 'days')
      .from(PlanHistoryEntity, 'plan_history')
      .innerJoin(PlanEntity, 'plan', 'plan.id = plan_history.planId')
      .orderBy('plan.days')
      .addOrderBy('plan_history.createdAt', 'DESC'),
})
export class AvailablePlanView {
  @ApiProperty()
  @ViewColumn()
  planHistoryId!: number;

  @ApiProperty()
  @ViewColumn()
  rate!: number;

  @ApiProperty()
  @ViewColumn()
  planId!: number;

  @ApiProperty()
  @ViewColumn()
  days!: number;
}
