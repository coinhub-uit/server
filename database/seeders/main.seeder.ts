import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import PlanSeeder from 'database/seeders/plan.seeder';
import PlanHistorySeeder from 'database/seeders/plan-history.seeder';
import UserSeeder from 'database/seeders/user.seeder';
import SourceSeeder from 'database/seeders/source.seeder';
import TicketAndTicketHistorySeeder from 'database/seeders/ticket-and-ticket-history.seeder';
import AdminSeeder from 'database/seeders/admin.seeder';

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
  }
}
