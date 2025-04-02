import { registerAs } from '@nestjs/config';

export type GeneralEnv = {
  nodeEnv: string;
};

export default registerAs(
  'general_env',
  () =>
    ({
      nodeEnv: process.env.NODE_ENV,
    }) satisfies GeneralEnv,
);
