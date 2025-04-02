// haiz dotenv cannot be loaded
import { config } from 'dotenv';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { hash } from 'src/common/utils/hashing';
config();

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743520036585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRepository = queryRunner.manager.getRepository(AdminEntity);
    await adminRepository.insert({
      username: 'admin',
      password: await hash('admin'),
    });

    // const userRepository = queryRunner.connection.getRepository(UserEntity);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase(process.env.DB_DATABASE);
  }
}
