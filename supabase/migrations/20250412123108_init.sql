-- vim:ft=sql.postgresql

-- Enable Supabase pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Enable Supabase pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Procedure insert_ticket_history
CREATE
OR REPLACE PROCEDURE insert_ticket_history(endDate DATE) LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO ticket_history (
    ticketId,
    issuedAt,
    maturedAt, 
    planHistoryId,
    amount
  )
  SELECT 
    th.ticketId,
    th.maturedAt AS issuedAt,
    th.maturedAt + INTERVAL '1 day' * p.days AS maturedAt,
    ph.id AS planHistoryId,
    CASE
      WHEN m.id = 'PIR' THEN th.amount + (th.amount * ph.rate / 100)
      ELSE th.amount
    END AS amount 
    FROM
    ticket t
    JOIN method m ON t.method = m.id
    JOIN (
      SELECT DISTINCT ON (ticketId) *
      FROM ticket_history
      ORDER BY ticketId, createdAt DESC
    ) th ON th.ticketId = t.id
    JOIN plan p ON th.planHistoryId = p.id
    JOIN plan_history ph ON ph.planId = p.id
    CROSS JOIN settings s
  WHERE
    t.closedAt IS NULL
    AND m.id IN ('PR', 'PIR')
    AND th.maturedAt <= endDate
    AND (
      (
        m.id = 'PR'
        AND s.balance >= s.minAmountOpenTicket
      )
      OR (
        m.id = 'PIR'
        AND (th.amount + (th.amount * ph.rate / 100)) >= s.minAmountOpenTicket
      )
    );
END;
$$;

-- Cron insert_ticket_history
SELECT
  cron.schedule(
    'renew_PR_PIR_tickets',
    '0 1 * * *',
    'CALL insert_ticket_history(CURRENT_DATE)'
  );

-- Procedure settlement_ticket
CREATE OR REPLACE PROCEDURE settlement_ticket(
  p_end_date DATE,
  p_ticket_id SERIAL,
  p_money NUMERIC
) LANGUAGE plpgsql AS $$
DECLARE 
  ticket_record RECORD;
  latest_ticket_history_record RECORD;
BEGIN
  SELECT t.id AS "ticketId" ,s.id AS "sourceId"
  INTO ticket_record
  FROM ticket t
  JOIN source s ON s.id = t."sourceId"
  WHERE t.id = p_ticket_id;

  SELECT *
  INTO latest_ticket_history_record
  FROM ticket_history th
  where th."ticketId" = p_ticket_id
  ORDER BY "issuedAt" DESC
  LIMIT 1;

  UPDATE ticket_history
  SET "maturedAt" = p_end_date
  WHERE "ticketId" = p_ticket_id AND "issuedAt" = latest_ticket_history_record."issuedAt";

  UPDATE source
  SET balance = balance + p_money
  WHERE id = ticket_record."sourceId";
  
  UPDATE ticket
  SET "closedAt" = p_end_date
  WHERE id = p_ticket_id;
END;
$$;


CREATE OR REPLACE PROCEDURE simulate_maturity_circle(
  ticket_history_id SERIAL
) LANGUAGE plpgsql AS
$$ 
DECLARE
  ticket_history_record RECORD; 
  ticket_record RECORD;
  plan_record RECORD;
  end_date DATE;

BEGIN
  SELECT * 
  INTO ticket_history_record
  FROM ticket_history th
  WHERE th.planHistoryId = ticket_history_id    

  SELECT *
  INTO ticket_record
  FROM ticket t
  WHERE t.id = ticket_history_record."ticketId"

  SELECT *
  INTO plan_record
  FROM plan p
  WHERE p."ticketId" = ticket_record.id 

  end_date := ticket_history_record.issuedAt + (plan_record.days || ' days')::INTERVAL; 

  UPDATE ticket_history 
  SET maturedAt = end_date
  WHERE id = ticket_history_id
  
  CALL insert_ticket_history(end_date) 
END;
$$
