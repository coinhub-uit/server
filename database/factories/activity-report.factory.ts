import { setSeederFactory } from 'typeorm-extension';
import { randomMoney } from 'lib/random-money';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';

export default setSeederFactory(ActivityReportEntity, (faker) => {
  const activityReport = new ActivityReportEntity();
  activityReport.totalPrincipal = randomMoney({ min: 2000000 });
  activityReport.users = faker.number.int({ min: 0, max: 10 });
  activityReport.tickets = faker.number.int({ min: 2, max: 20 });
  return activityReport;
});
