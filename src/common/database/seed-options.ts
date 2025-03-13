import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { datasourceOptions } from 'src/common/database/options';
import { resolve as pathResolve } from 'path';

export const seedDataSourceOptions: DataSourceOptions & SeederOptions = {
  ...datasourceOptions,
  seeds: [pathResolve(__dirname, '..') + '/**/seeds/*.seeder.{ts,js}'],
};
