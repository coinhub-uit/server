import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class TicketRenewalCronJob1744113884366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    const queries = SqlReader.readSqlFile(
      path.join(__dirname, 'ticket-renewal-cron-job.sql'),
    );

    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down() {}
}
