import { config } from 'dotenv';
import { MigrationInterface, QueryRunner } from 'typeorm';

config();

export class Migrations1743520036585 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
