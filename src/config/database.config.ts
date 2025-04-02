import { registerAs } from '@nestjs/config';
import { dataSourceOptions } from 'src/common/database/options';
import { DataSourceOptions } from 'typeorm';

export default registerAs(
  'database_config',
  (): DataSourceOptions => dataSourceOptions,
);
