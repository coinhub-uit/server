import { registerAs } from '@nestjs/config';

export type SecretEnv = {
  auth: {
    supabaseJwtSecret: string;
    adminJwtSecret: string;
    adminJwtRefreshSecret: string;
  };
  apiKey: {
    ai: string;
  };
};

export default registerAs(
  'secret_env',
  () =>
    ({
      auth: {
        supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
        adminJwtSecret: process.env.ADMIN_JWT_SECRET,
        adminJwtRefreshSecret: process.env.ADMIN_JWT_REFRESH_SECRET,
      },
      apiKey: {
        ai: process.env.AI_API_KEY,
      },
    }) satisfies SecretEnv,
);
