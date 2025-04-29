import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ActivityReportEntity } from 'src/report/entities/activity-report.entity';

export default class ActivityReportSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    await datasource.manager.transaction(async (transactionEntityManager) => {
      const activityReportRepository =
        transactionEntityManager.getRepository(ActivityReportEntity);
      const activityReportFactory = factoryManager.get(ActivityReportEntity);

      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() - 2);
      currentDate.setDate(1);

      const now = new Date();
      now.setDate(1);

      while (currentDate <= now) {
        const activityReportEntity = await activityReportFactory.make({
          date: currentDate,
        });
        activityReportRepository.insert(activityReportEntity);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });
  }
}
