import ActivityReportSeeder from 'database/seeders/activity-report.seeder';
import AdminSeeder from 'database/seeders/admin.seeder';
import PlanHistorySeeder from 'database/seeders/plan-history.seeder';
import PlanSeeder from 'database/seeders/plan.seeder';
import RevenueReportSeeder from 'database/seeders/revenue-report.seeder';
import SettingsSeeder from 'database/seeders/settings.seeder';
import SourceSeeder from 'database/seeders/source.seeder';
import TicketAndTicketHistorySeeder from 'database/seeders/ticket-and-ticket-history.seeder';
import TicketReportSeeder from 'database/seeders/ticket-report.seeder';
import UserSeeder from 'database/seeders/user.seeder';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

async function seedSettings(dataSource: DataSource) {
  await new SettingsSeeder().run(dataSource);
  console.log('Seeded settings');
}

async function seedAdmin(dataSource: DataSource) {
  await new AdminSeeder().run(dataSource);
  console.log('Seeded admin(s)');
}

async function seedPlan(dataSource: DataSource) {
  await new PlanSeeder().run(dataSource);
  console.log('Seeded plans');
}

async function seedPlanHistory(dataSource: DataSource) {
  await new PlanHistorySeeder().run(dataSource);
  console.log('Seeded plan histories');
}

async function seedUser(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
) {
  await new UserSeeder().run(dataSource, factoryManager);
  console.log('Seeded users');
}

async function seedSource(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
) {
  await new SourceSeeder().run(dataSource, factoryManager);
  console.log('Seeded sources');
}

async function seedTicketAndTicketHistory(dataSource: DataSource) {
  await new TicketAndTicketHistorySeeder().run(dataSource);
  console.log('Seeded tickets and ticket histories');
}

async function seedActivityReport(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
) {
  await new ActivityReportSeeder().run(dataSource, factoryManager);
  console.log('Seeded activity report');
}

async function seedRevenueReport(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
) {
  await new RevenueReportSeeder().run(dataSource, factoryManager);
  console.log('Seeded revenue report');
}

async function seedTicketReport(
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
) {
  await new TicketReportSeeder().run(dataSource, factoryManager);
  console.log('Seeded ticket report');
}

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await Promise.all([
      seedAdmin(dataSource),
      seedSettings(dataSource),
      seedPlan(dataSource),
      seedUser(dataSource, factoryManager),
      seedActivityReport(dataSource, factoryManager),
      seedRevenueReport(dataSource, factoryManager),
      seedTicketReport(dataSource, factoryManager),
    ]);

    await Promise.all([
      seedPlanHistory(dataSource),
      seedSource(dataSource, factoryManager),
    ]);

    await seedTicketAndTicketHistory(dataSource);
  }
}
