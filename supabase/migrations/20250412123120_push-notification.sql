-- vim:ft=sql.postgresql

CREATE OR REPLACE TRIGGER push_notification_webhook
AFTER INSERT ON public.notification
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://yopvlrbdzgkmbfilgrqf.supabase.co/functions/v1/push-notification',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '5000'
);
