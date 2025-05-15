CREATE OR REPLACE FUNCTION on_balance_change()
RETURN TRIGGER AS $$
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
$$ LANGUAGE plpsql;

CREATE TRIGGER trigger_balance_change
AFTER UPDATE ON public.source
FOR EACH ROW
EXECUTE FUNCTION on_balance_change();
