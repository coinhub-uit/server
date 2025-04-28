-- vim:ft=plsql.postgresql

-- Enable Supabase pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Enable Supabase pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;
