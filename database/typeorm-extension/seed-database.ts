import { config } from 'dotenv';
import { dataSourceOptions } from 'src/common/database/options';
import { resolve as pathResolve } from 'path';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import MainSeeder from 'database/seeders/main.seeder';

config();

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [MainSeeder],
    factories: [
      pathResolve(__dirname, '..') + '/**/factories/*.factory.{ts,js}',
    ],
  });
}

void seed();
