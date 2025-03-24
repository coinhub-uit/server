import { datasourceOptions } from 'src/common/database/options';
import { resolve as pathResolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

async function seed() {
  const options: DataSourceOptions = datasourceOptions;

  // NOTE: We don't need to create db here. Just seeding

  // await createDatabase({
  //   options,
  // });

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [pathResolve(__dirname, '..') + '/**/seeds/*.seeder.{ts,js}'],
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
seed();
