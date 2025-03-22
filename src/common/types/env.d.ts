declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | '';
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_NAME: string;
    DB_PORT: string;
    AI_API_KEY: string;
    ADMIN_JWT_SECRET: string;
    ADMIN_JWT_SECRET: string;
    ADMIN_JWT_REFRESH_SECRET: string;
    APP_NO_LISTEN: string;
    TMN_CODE: string;
    SECURE_SECRET: string;
    VNPAY_HOST: string;
  }
}
