-- vim:ft=plsql.postgresql

CREATE OR REPLACE PROCEDURE withdraw_ticket(
  endDate DATE,
  ticketId INTEGER,
  money DECIMAL(12, 0)
) LANGUAGE plpgsql AS $$
  DECLARE
    ticketRecord RECORD;
    latestTicketHistoryRecord RECORD;
  BEGIN
    SELECT t."id" AS "ticketId", s."id" AS "sourceId"
    INTO ticketRecord
    FROM ticket AS t
    JOIN source AS s ON s."id" = t."sourceId"
    WHERE t."id" = ticketId;

    SELECT *
    INTO latestTicketHistoryRecord
    FROM ticket_history th
    where th."ticketId" = ticketId
    ORDER BY "issuedAt" DESC
    LIMIT 1;

    UPDATE source
    SET "balance" = "balance" + money
    WHERE "id" = ticketRecord."sourceId";

    UPDATE ticket
    SET "closedAt" = endDate AND "status" = "earlyWithdrawn"
    WHERE "id" = "_ticketId";

    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error occurred: %', SQLERRM;
      RAISE;
  END;
$$;

CREATE OR REPLACE PROCEDURE simulate_maturity_circle(
  ticketId INTEGER
) LANGUAGE plpgsql AS $$
  DECLARE
    ticketHistoryRecord RECORD;
    ticketRecord RECORD;
    planRecord RECORD;
    endDate DATE;
  BEGIN
    SELECT *
    INTO ticketHistoryRecord
    FROM ticket_history AS th
    WHERE th."ticketId" = ticketId
    ORDER BY th."issuedAt" DESC
    LIMIT 1;

    SELECT *
    INTO ticketRecord
    FROM ticket AS t
    WHERE t."id" = ticketHistoryRecord."ticketId";

    SELECT p."days"
    INTO planRecord
    FROM plan AS p
    JOIN ticket t ON t."planId" = p."id";

    endDate := ticketHistoryRecord."issuedAt" + INTERVAL '1 day' * planRecord."days";

    UPDATE ticket_history
    SET "maturedAt" = endDate
    WHERE "ticketId" = ticketRecord."id" AND "issuedAt" = ticketHistoryRecord."issuedAt";

    CALL rotate_ticket(endDate);

    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error occurred: %', SQLERRM;
      RAISE;
  END;
$$;
