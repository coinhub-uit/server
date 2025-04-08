import { resolve as pathResolve } from 'path';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    pathResolve(__dirname, '../../') + '/**/entities/*.entity.{ts,js}',
  ],
  migrations: [
    pathResolve(__dirname, '../../../') + '/database/migrations/*{.ts,.js}',
  ],
  synchronize: process.env.NODE_ENV === 'development',
};
