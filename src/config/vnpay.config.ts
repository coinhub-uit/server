import { registerAs } from '@nestjs/config';
import { VnpayModuleOptions } from 'nestjs-vnpay';

export default registerAs(
  'vnpay',
  (): VnpayModuleOptions => ({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_SECURE_SECRET,
    vnpayHost: process.env.VNPAY_HOST,
  }),
);
