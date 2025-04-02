import { config } from 'dotenv';
config();

import { dataSourceOptions } from 'src/common/database/options';
import { DataSource } from 'typeorm';

const dataSource: DataSource = new DataSource(dataSourceOptions);
export default dataSource;
