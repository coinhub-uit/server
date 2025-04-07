import { registerAs } from '@nestjs/config';
import { dataSourceOptions } from 'src/common/database/options';

export default registerAs('database_config', () => dataSourceOptions);
