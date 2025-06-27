-- vim:ft=plsql.postgresql

CREATE OR REPLACE FUNCTION check_min_money()
RETURNS TRIGGER AS $$
DECLARE
  minPrincipalAmount DECIMAL(12,0);
  ticketPrincipal DECIMAL(12,0);
BEGIN
  SELECT th."principal" INTO ticketPrincipal
  FROM ticket_history AS th
  WHERE th."ticketId" = NEW."id"
  LIMIT 1;

  SELECT s."minAmountOpenTicket" INTO minPrincipalAmount FROM settings AS s LIMIT 1;

  IF ticketPrincipal < minPrincipalAmount THEN
    RAISE EXCEPTION 'principal amount %VND does not meet the minimum requirement %VND', ticketPrincipal, minPrincipalAmount;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_min_money_trigger
AFTER INSERT ON ticket
FOR EACH ROW
EXECUTE FUNCTION check_min_money();
