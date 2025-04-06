import { config } from 'dotenv';
import { dataSourceOptions } from 'src/common/database/options';
import { DataSource } from 'typeorm';

config();

const dataSource: DataSource = new DataSource(dataSourceOptions);
export default dataSource;
