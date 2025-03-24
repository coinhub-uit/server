import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'admin-jwt',
  (): JwtModuleOptions => ({
    secret: process.env.ADMIN_JWT_SECRET,
    signOptions: {
      expiresIn: '1h',
    },
  }),
);
