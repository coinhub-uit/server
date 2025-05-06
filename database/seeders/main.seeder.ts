import ActivityReportSeeder from 'database/seeders/activity-report.seeder';
import AdminSeeder from 'database/seeders/admin.seeder';
import PlanHistorySeeder from 'database/seeders/plan-history.seeder';
import PlanSeeder from 'database/seeders/plan.seeder';
import RevenueReportSeeder from 'database/seeders/revenue-report.seeder';
import SourceSeeder from 'database/seeders/source.seeder';
import TicketAndTicketHistorySeeder from 'database/seeders/ticket-and-ticket-history.seeder';
import TicketReportSeeder from 'database/seeders/ticket-report.seeder';
import UserSeeder from 'database/seeders/user.seeder';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // admin
    await new AdminSeeder().run(dataSource);
    console.log('Seeded admin(s)');

    // plan
    await new PlanSeeder().run(dataSource);
    console.log('Seeded plans');

    // planHistory
    await new PlanHistorySeeder().run(dataSource);
    console.log('Seeded plan histories');

    // user
    await new UserSeeder().run(dataSource, factoryManager);
    console.log('Seeded users');

    // source
    await new SourceSeeder().run(dataSource, factoryManager);
    console.log('Seeded sources');

    // ticket
    await new TicketAndTicketHistorySeeder().run(dataSource);
    console.log('Seeded tickets and ticket histories');

    // activity report
    await new ActivityReportSeeder().run(dataSource, factoryManager);
    console.log('Seeded activity report');

    // revenue report
    await new RevenueReportSeeder().run(dataSource, factoryManager);
    console.log('Seeded revenue report');

    // ticket report
    await new TicketReportSeeder().run(dataSource, factoryManager);
    console.log('Seeded ticket report');
  }
}
