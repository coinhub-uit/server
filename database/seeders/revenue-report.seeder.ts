import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { RevenueReportEntity } from 'src/report/entities/revenue-report.entity';

export default class RevenueReportSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    await datasource.manager.transaction(async (transactionEntityManager) => {
      const revenueReportRepository =
        transactionEntityManager.getRepository(RevenueReportEntity);
      const revenueReportFactory = factoryManager.get(RevenueReportEntity);
      const planRepository = transactionEntityManager.getRepository(PlanEntity);
      const planDays = (await planRepository.find()).map(
        (planEntity) => planEntity.days,
      );

      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() - 2);
      currentDate.setDate(1);

      const now = new Date();
      now.setDate(1);

      while (currentDate <= now) {
        for (const days of planDays) {
          const revenueReportEntity = await revenueReportFactory.make({
            date: currentDate,
            days,
          });
          revenueReportRepository.insert(revenueReportEntity);
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });
  }
}
