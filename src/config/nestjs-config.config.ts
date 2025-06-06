import { ConfigModuleOptions } from '@nestjs/config';
import adminJwtConfig from 'src/config/admin.jwt.config';
import adminRefreshJwtConfig from 'src/config/admin.refresh-jwt.config';
import databaseConfig from 'src/config/database.config';
import userJwtConfig from 'src/config/user.jwt.config';
import vnpayConfig from 'src/config/vnpay.config';

export const configModuleOptions: ConfigModuleOptions = {
  load: [
    adminJwtConfig,
    adminRefreshJwtConfig,
    databaseConfig,
    userJwtConfig,
    vnpayConfig,
  ],
  envFilePath: ['.env', '.env.local', '.env.development'],
  isGlobal: true,
};
