-- vim:ft=plsql.postgresql

CREATE OR REPLACE FUNCTION refresh_available_plan()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW available_plan;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_available_plan
AFTER INSERT ON public.plan_history
FOR EACH ROW
EXECUTE FUNCTION refresh_available_plan();
