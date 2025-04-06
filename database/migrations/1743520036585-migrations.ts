import { config } from 'dotenv';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { hash } from 'lib/hashing';
import { MigrationInterface, QueryRunner } from 'typeorm';

config();

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
