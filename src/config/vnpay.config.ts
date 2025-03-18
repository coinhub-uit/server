import { registerAs } from '@nestjs/config';
import { VnpayModuleOptions } from 'nestjs-vnpay';

export default registerAs(
  'vnpay',
  (): VnpayModuleOptions => ({
    tmnCode: process.env.TMN_CODE,
    secureSecret: process.env.SECURE_SECRET,
    vnpayHost: process.env.VNPAY_HOST,
  }),
);
