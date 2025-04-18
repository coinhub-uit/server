import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { ViewColumn, ViewEntity, DataSource } from 'typeorm';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
@ViewEntity({
  name: 'available_plan',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .distinctOn(['plan.days'])
      .select('plan_history.id', 'id')
      .addSelect('plan_history.rate', 'rate')
      .addSelect('plan.id', 'planId')
      .addSelect('plan.days', 'days')
      .from(PlanHistoryEntity, 'plan_history')
      .innerJoin(PlanEntity, 'plan', 'plan.id = plan_history.id')
      .orderBy('plan.days')
      .addOrderBy('plan_history.createdAt', 'DESC'),
})
export class AvailablePlanEntity {
  @ApiProperty()
  @ViewColumn()
  id!: string;

  @ApiProperty()
  @ViewColumn()
  rate!: number;

  @ApiProperty()
  @ViewColumn()
  planId!: string;

  @ApiProperty()
  @ViewColumn()
  days!: number;
}
