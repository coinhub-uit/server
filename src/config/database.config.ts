import { registerAs } from '@nestjs/config';
import { datasourceOptions } from 'src/common/database/options';
import { DataSourceOptions } from 'typeorm';

export default registerAs(
  'database',
  (): DataSourceOptions => datasourceOptions,
);
