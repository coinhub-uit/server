import { seedDataSourceOptions } from 'src/common/database/seed-options';
import { DataSource, DataSourceOptions } from 'typeorm';

async function seed() {
  const options: DataSourceOptions = seedDataSourceOptions;

  // NOTE: We don't need to create db here. Just seeding

  // await createDatabase({
  //   options,
  // });

  const dataSource = new DataSource(options);
  await dataSource.initialize();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
seed();
