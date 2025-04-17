-- vim:ft=sql.postgresql

-- Enable Supabase pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

GRANT USAGE ON SCHEMA cron TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Enable Supabase pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;


-- TODO: Update ticket.status

-- Procedure insert_ticket_history
CREATE
OR REPLACE PROCEDURE insert_ticket_history(endDate DATE) LANGUAGE plpgsql AS $$
BEGIN
  -- TODO: update balance for PR
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

-- TODO: insert_ticket_history name is suck
-- TODO: renew_PR_PIR_tickets too

-- Cron insert_ticket_history
SELECT
  cron.schedule(
    'renew_PR_PIR_tickets',
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

  -- NOTE: maturedAt???
  UPDATE ticket_history
  SET "maturedAt" = pEndDate
  WHERE "ticketId" = pTicketId AND "issuedAt" = latestTicketHistoryRecord."issuedAt";

  UPDATE source
  SET balance = balance + pMoney
  WHERE id = ticketRecord."sourceId";

  UPDATE ticket
  SET "closedAt" = pEndDate
  WHERE id = pTicketId;
END;
$$;


CREATE OR REPLACE PROCEDURE simulate_maturity_circle(
  pTicketHistoryId INTEGER
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
  WHERE th.planHistoryId = pTicketHistoryId;

  SELECT *
  INTO ticketRecord
  FROM ticket t
  WHERE t.id = ticketHistoryRecord."ticketId";

  SELECT *
  INTO planRecord
  FROM plan p
  WHERE p."ticketId" = ticketRecord.id;

  endDate := ticketHistoryRecord.issuedAt + (planRecord.days || ' days')::INTERVAL;

  UPDATE ticket_history
  SET maturedAt = endDate
  WHERE id = pTicketHistoryId;

  CALL insert_ticket_history(endDate);
END;
$$;
