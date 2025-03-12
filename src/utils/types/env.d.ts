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
    SUPABASE_JWT_SECRET: string;
    JWT_LOCAL_SECRET: string;
    JWT_REFRESH_SECRET: string;
    APP_NO_LISTEN: string;
  }
}
