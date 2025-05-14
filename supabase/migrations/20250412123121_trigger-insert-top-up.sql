-- vim:ft=plsql.postgresql

CREATE OR REPLACE FUNCTION push_notification_top_up()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification (title, body)
  VALUES (
    'Top up successfully',
    FORMAT('Your top-up of %s using %s to %s has been processed successfully.', NEW.amount, NEW.provider, NEW."sourceDestinationId")
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER push_notification_insert_top_up
AFTER INSERT OR UPDATE ON public.top_up
FOR EACH ROW
EXECUTE FUNCTION push_notification_top_up();
