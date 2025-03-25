import { PlanHistoryEntity } from 'src/plan/entities/plan-history.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(PlanHistoryEntity, async (faker) => {
  const planHistory = new PlanHistoryEntity({
    definedDate: faker.date.past({
      years: 2,
    }),
    rate: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
  });
  return planHistory;
});
