import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt-supabase',
  (): JwtModuleOptions => ({
    secret: process.env.ADMIN_JWT_SECRET,
  }),
);
