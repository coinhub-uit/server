import { registerAs } from '@nestjs/config';

export type PaymentEnv = {
  vnpay: {
    tmnCode: string;
    secureSecret: string;
    vnpayHost: string;
  };
};

export default registerAs(
  'payment_env',
  () =>
    ({
      vnpay: {
        tmnCode: process.env.VNPAY_TMN_CODE,
        secureSecret: process.env.VNPAY_SECURE_SECRET,
        vnpayHost: process.env.VNPAY_HOST,
      },
    }) satisfies PaymentEnv,
);
