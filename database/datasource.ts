import { config } from 'dotenv';
import { getDataSourceOptions } from 'src/common/database/options';
import { DataSource } from 'typeorm';

config();

const dataSource: DataSource = new DataSource(getDataSourceOptions());
export default dataSource;
