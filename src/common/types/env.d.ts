declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | '';
    API_SERVER_URL: string;
    UPLOAD_PATH: string;
    REDIS_URL: string;
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_PORT: string;
    SUPABASE_PROJECT_API_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    ADMIN_JWT_SECRET: string;
    ADMIN_JWT_REFRESH_SECRET: string;
    VNPAY_TMN_CODE: string;
    VNPAY_SECURE_SECRET: string;
    VNPAY_HOST: string;
    OPENAI_API_KEY: string;
    OPENAI_BASE_URL: string;
    OPENAI_MODEL: string;
  }
}
