CREATE EXTENSION pg_cron
WITH
  schemA PG_CATALOG;

GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
