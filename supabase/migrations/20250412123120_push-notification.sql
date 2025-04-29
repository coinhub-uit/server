-- vim:ft=sql.postgresql

CREATE TRIGGER push_notification_webhook AFTER INSERT
ON public.notification FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'http://host.docker.internal:3000/functions/v1/push-notification',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
