import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketRenewalCronJob1744113884366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
    CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
    GRANT USAGE ON SCHEMA cron TO postgres;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;`);

    await queryRunner.query(` SELECT cron.schedule(
        'renew_PR_PIR_tickets',
        '0 1 * * *',
        $$
        INSERT INTO ticket_history (ticketId, issuedAt, maturedAt, planHistoryId, amount)
        SELECT
          th.ticketId,
          th.maturedAt AS issuedAt,
          th.maturedAt + INTERVAL '1 day' * p.days AS maturedAt,
          ph.id AS planHistoryId,
          CASE
            WHEN m.id = 'PIR' THEN
              th.amount + (th.amount * ph.rate / 100)
            ELSE
              s.balance
          END AS amount
        FROM ticket t
        JOIN method m ON t.method = m.id
        JOIN ticket_history th ON th.ticketId = t.id
        JOIN (
          SELECT ticketId, MAX(createdAt) AS latest FROM ticket_history GROUP BY ticketId
        ) last ON last.ticketId = th.ticketId AND th.createdAt = last.latest
        JOIN plan p ON th.planHistoryId = p.id
        JOIN plan_history ph ON ph.planId = p.id
        CROSS JOIN settings s
        WHERE 
          t.closedAt IS NULL
          AND m.id IN ('PR', 'PIR')
          AND th.maturedAt <= CURRENT_DATE
          AND (
            (m.id = 'PR' AND s.balance >= s.minAmountOpenTicket)
            OR
            (m.id = 'PIR' AND (th.amount + (th.amount * ph.rate / 100)) >= s.minAmountOpenTicket)
          );
        $$
      );
    `);
  }

  public async down() {}
}
