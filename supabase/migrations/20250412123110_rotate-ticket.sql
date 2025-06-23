-- vim:ft=plsql.postgresql

CREATE OR REPLACE PROCEDURE rotate_ticket(endDate DATE)
LANGUAGE plpgsql AS $$
  BEGIN
    INSERT INTO ticket_history (
      "ticketId",
      "issuedAt",
      "maturedAt",
      "planHistoryId",
      "principal",
      "interest"
    )
    SELECT
      th."ticketId",
      th."maturedAt" + INTERVAL '1 day' AS "issuedAt",
      th."maturedAt" + INTERVAL '1 day' * p.days + INTERVAL '1 day' AS "maturedAt",
      p.id AS "planHistoryId",
      CASE
        WHEN t."method" = 'PIR'
          THEN th."principal" + th."interest"
        ELSE th."principal"
      END AS "principal",
      CASE
        WHEN t."method" = 'PIR'
          THEN (th."principal" + th."interest")*(p."rate"/100)*(p."days"/365)
        ELSE th."interest"
      END AS "interest"
      FROM ticket AS t
      JOIN ticket_history AS th ON th."ticketId" = t."id"
      JOIN available_plan AS p ON t."planId" = p."planId"
      JOIN source AS s ON s."id" = t."sourceId"
    WHERE
      t."closedAt" IS NULL AND t."status" = 'active'
      AND t."method" IN ('PR', 'PIR')
      AND th."maturedAt" = endDate;

  UPDATE source AS s
  SET balance = s."balance" + "interest"
  FROM ticket AS t
  JOIN ticket_history AS th ON t."id" = th."ticketId"
  JOIN available_plan AS p ON t."planId"= p."planId"
  WHERE method = 'PR'
    AND t."sourceId" = s."id"
    AND th."maturedAt" = endDate;

  UPDATE ticket AS t
  SET "closedAt" = endDate,
      "status" = 'maturedWithdrawn'
  FROM available_plan AS p,
    ticket_history AS th
  WHERE p."planId" = t."planId"
    AND th."ticketId" = t.id
    AND method = 'NR'
    AND th."maturedAt" = endDate;

  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
    RAISE;
  END;
$$;

SELECT cron.schedule(
  'rotate_ticket_cron',
  '0 0 * * *',
  'CALL rotate_ticket(CURRENT_DATE)'
);
