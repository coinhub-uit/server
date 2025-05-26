-- vim:ft=plsql.postgresql

CREATE OR REPLACE FUNCTION on_balance_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.balance IS DISTINCT FROM OLD.balance THEN
    INSERT INTO public.notification (title, body)
    VALUES (
      'Your balance change',
      FORMAT('Your balance changed from % to %', OLD.balance, NEW.balance)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER TRIGGER_BALANCE_CHANGE
AFTER UPDATE ON PUBLIC.SOURCE
FOR EACH ROW
EXECUTE FUNCTION on_balance_change();
