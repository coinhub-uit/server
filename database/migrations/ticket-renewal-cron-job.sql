CREATE EXTENSION IF NOT EXISTS pg_cron
WITH
  SCHEMA pg_catalog;

-- GRANT USAGE ON SCHEMA cron TO postgres;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

CREATE OR REPLACE PROCEDURE insert_ticket_history()
LANGUAGE plpgsql
AS $$
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
      ELSE s.balance
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
    AND th.maturedAt <= CURRENT_DATE
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

SELECT
  cron.schedule (
    'renew_PR_PIR_tickets',
    '0 1 * * *',
    'CALL insert_ticket_history()'
  );
