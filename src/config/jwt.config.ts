import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_LOCAL_SECRET,
    signOptions: {
      expiresIn: '3h',
    },
  }),
);
