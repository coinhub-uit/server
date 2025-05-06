import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { TicketReportEntity } from 'src/report/entities/ticket-report.entity';

export default class TicketReportSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    await datasource.manager.transaction(async (transactionEntityManager) => {
      const ticketReportRepository =
        transactionEntityManager.getRepository(TicketReportEntity);
      const ticketReportFactory = factoryManager.get(TicketReportEntity);
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
        const newCurrentDate = new Date(currentDate);
        for (const days of planDays) {
          const ticketReportEntity = await ticketReportFactory.make({
            date: newCurrentDate,
            days,
          });
          await ticketReportRepository.insert(ticketReportEntity);
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });
  }
}
