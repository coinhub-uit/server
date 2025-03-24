import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'user-jwt',
  (): JwtModuleOptions => ({
    secret: process.env.SUPABASE_JWT_SECRET,
  }),
);
