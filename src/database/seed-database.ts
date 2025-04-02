import { dataSourceOptions } from 'src/common/database/options';
import { resolve as pathResolve } from 'path';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

async function freshSeed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [pathResolve(__dirname, '..') + '/**/seeds/*.seeder.{ts,js}'],
    factories: [
      pathResolve(__dirname, '..') + '/**/factories/*.factory.{ts,js}',
    ],
  });
}

void freshSeed();
