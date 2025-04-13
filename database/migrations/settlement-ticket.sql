CREATE
OR REPLACE PROCEDURE settlement_ticket (p_end_date DATE, p_ticket_id INTEGER, p_money NUMERIC)
LANGUAGE plpsql
AS $$
DECLARE 
  ticket_record RECORD;
  latest_ticket_history_record RECORD;
BEGIN
  SELECT t.*, s.id AS source_id
  INTO ticket_record
  FROM ticket t
  JOIN source s ON s.id = t.source_id
  WHERE t.id = p_ticket_id;

  SELECT *
  INTO latest_ticket_history_record
  FROM ticket_history th
  where th.ticket_id = p_ticket_id
  ORDER BY issuedAt DESC
  LIMIT 1;

  UPDATE ticket_history
  SET maturedAt = p_end_date
  WHERE ticket_id = p_ticket_id AND issuedAt = latest_ticket_history_record.issuedAt;

  UPDATE source
  SET balance = balance + in_money
  WHERE id = ticket_record.source_id;

  UPDATE ticket
  SET closedAt = p_end_date
  WHERE id = in_ticket_id;
END;
$$;
