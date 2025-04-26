-- vim:ft=plsql.postgresql

-- Enable Supabase pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Enable Supabase pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Procedure insert_ticket_history
CREATE
OR REPLACE PROCEDURE rotate_ticket(pendDate DATE) LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO ticket_history (
    "ticketId",
    "issuedAt",
    "maturedAt",
    "planHistoryId",
    principal
    interest
  )
  SELECT
    th."ticketId",
    th."maturedAt" + INTERVAL '1 day' AS "issuedAt",
    th."maturedAt" + INTERVAL '1 day' * p.days + INTERVAL '1 day' AS "maturedAt",
    p.id AS "planHistoryId",
    CASE
      WHEN t.method = 'PIR' THEN th.principal + (th.principal * p.rate / 100)
      ELSE th.principal
    END AS principal,
    CASE
      WHEN t.method = 'PIR' THEN (th.principal + th.interest)*(p.rate/100)
      ELSE th.interest
    END AS interest
    FROM
    ticket t
    JOIN ticket_history th ON th."ticketId" = t.id
    JOIN available_plan p ON t."planId" = p."planId"
    JOIN source so ON so.id = t."sourceId"
  WHERE
    t."closedAt" IS NULL AND t.status = 'active'
    AND t.method IN ('PR', 'PIR')
    AND th."maturedAt" = pendDate;

UPDATE source AS s
SET balance = s.balance + interest
FROM ticket AS t
JOIN ticket_history AS th ON t.id = th."ticketId"
JOIN available_plan AS p ON t."planId"= p."planId"
WHERE method = 'PR'
  AND t."sourceId" = s.id
  AND th."maturedAt" = pendDate;

UPDATE ticket AS t
SET "closedAt" = pendDate,
    status = 'maturedWithdrawn'
FROM available_plan AS p, ticket_history AS th
WHERE p."planId" = t."planId"
  AND th."ticketId" = t.id
  AND method = 'NR'
  AND th."maturedAt" = pendDate;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
      RAISE;

END;
$$;

-- Cron insert_ticket_history
SELECT
  cron.schedule(
    'rotate_ticket_cron_schedule',
    '0 0 * * *',
    'CALL insert_ticket_history(CURRENT_DATE)'
  );

-- Procedure withdraw_ticket
CREATE OR REPLACE PROCEDURE withdraw_ticket(
  pEndDate DATE,
  pTicketId INTEGER,
  pMoney NUMERIC
) LANGUAGE plpgsql AS $$
DECLARE
  ticketRecord RECORD;
  latestTicketHistoryRecord RECORD;
BEGIN
  SELECT t.id AS "ticketId", s.id AS "sourceId"
  INTO ticketRecord
  FROM ticket t
  JOIN source s ON s.id = t."sourceId"
  WHERE t.id = pTicketId;

  SELECT *
  INTO latestTicketHistoryRecord
  FROM ticket_history th
  where th."ticketId" = pTicketId
  ORDER BY "issuedAt" DESC
  LIMIT 1;

  UPDATE source
  SET balance = balance + pMoney
  WHERE id = ticketRecord."sourceId";

  UPDATE ticket
  SET "closedAt" = pEndDate AND status = "earlyWithdrawn"
  WHERE id = pTicketId;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;


END;
$$;


CREATE OR REPLACE PROCEDURE simulate_maturity_circle(
  pTicketId INTEGER
) LANGUAGE plpgsql AS
$$
DECLARE
  ticketHistoryRecord RECORD;
  ticketRecord RECORD;
  planRecord RECORD;
  endDate DATE;

BEGIN
  SELECT *
  INTO ticketHistoryRecord
  FROM ticket_history th
  WHERE th."ticketId" = pTicketId
  ORDER BY th."issuedAt" DESC
  LIMIT 1;

  SELECT *
  INTO ticketRecord
  FROM ticket t
  WHERE t.id = ticketHistoryRecord."ticketId";

  SELECT p.days
  INTO planRecord
  FROM plan p
  JOIN ticket t ON t."planId" = p.id;

  endDate := ticketHistoryRecord."issuedAt" + INTERVAL '1 day' * planRecord.days;

  UPDATE ticket_history
  SET "maturedAt" = endDate
  WHERE "ticketId" = ticketRecord.id AND "issuedAt" = ticketHistoryRecord."issuedAt";

  CALL rotate_ticket(endDate);

  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;


END;
$$;
