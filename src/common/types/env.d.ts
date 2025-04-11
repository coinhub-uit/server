declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | '';
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_PORT: string;
    AI_API_KEY: string;
    SUPABASE_PROJECT_ID: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    ADMIN_JWT_SECRET: string;
    ADMIN_JWT_REFRESH_SECRET: string;
    VNPAY_TMN_CODE: string;
    VNPAY_SECURE_SECRET: string;
    VNPAY_HOST: string;
  }
}
