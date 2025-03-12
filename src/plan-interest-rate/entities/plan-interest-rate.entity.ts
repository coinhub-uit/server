import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
      SELECT
          p.planId,
          p.days,
          p.isDisabled,
          ir.rate AS latest_rate,
          ir.createdAt AS latest_rate_created_at
      FROM plan p
      LEFT JOIN LATERAL (
          SELECT ir.rate, ir.createdAt
          FROM interest_rate ir
          WHERE ir.planId = p.planId
          ORDER BY ir.createdAt DESC
          LIMIT 1
      ) ir ON true;
    `,
})
export class PlanInterestRate {
  @ViewColumn()
  planId: string;

  @ViewColumn()
  days: number;

  @ViewColumn()
  isDisabled: boolean;

  @ViewColumn()
  latest_rate: string;

  @ViewColumn()
  createdAt: Date;
}
