// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { config } from 'dotenv';
import { getDataSourceOptions } from '../src/common/database/options';
import { resolve as pathResolve } from 'path';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

config({
  path: '../.env',
});

async function seed() {
  console.log('cool' + process.env.DB_PORT);
  const dataSource = new DataSource(getDataSourceOptions());
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [pathResolve(__dirname) + '/**/seeders/*.seeder.{ts,js}'],
    factories: [pathResolve(__dirname) + '/**/factories/*.factory.{ts,js}'],
  });
}

void seed();
