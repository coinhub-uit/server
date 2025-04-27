CREATE OR REPLACE FUNCTION check_min_money()
RETURNS TRIGGER AS $$
DECLARE
  minPrincipalAmount NUMERIC;
BEGIN
  SELECT minPrincipalOpenTicket INTO minPrincipalAmount FROM settings LIMIT 1;

  IF NEW.principal < minPrincipalAmount THEN
    RAISE EXCEPTION 'principal amount % exceeds minimum allowed %', NEW.principal, minPrincipalAmount;
  END IF

  RETURN NEW;
END;
$$ LANGUAGE plpsql;

CREATE TRIGGER check_min_money_trigger
AFTER INSERT ON ticket_history
FOR EACH ROW
EXECUTE FUNCTION check_min_money();
