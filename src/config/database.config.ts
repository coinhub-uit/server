import { registerAs } from '@nestjs/config';
import { getDataSourceOptions } from 'src/common/database/options';

export default registerAs('database_config', getDataSourceOptions);
