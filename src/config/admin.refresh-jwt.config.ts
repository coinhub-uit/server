import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'admin-refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.ADMIN_JWT_REFRESH_SECRET,
    expiresIn: '7d',
  }),
);
