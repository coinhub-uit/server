import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'admin-jwt',
  (): JwtSignOptions => ({
    secret: process.env.ADMIN_JWT_SECRET,
    expiresIn: '1h',
  }),
);
