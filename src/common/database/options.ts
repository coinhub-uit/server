import { resolve as pathResolve } from 'path';
import { DataSourceOptions } from 'typeorm';

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    pathResolve(__dirname, '../../') + '/**/entities/*.entity.{ts,js}',
  ],
  synchronize: process.env.NODE_ENV === 'development',
};
