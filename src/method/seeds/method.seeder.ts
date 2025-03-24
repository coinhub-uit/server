import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { MethodId } from 'src/method/types/method-id.enum';

export default class MethodSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(MethodEntity);
    await repository.insert([
      { id: MethodId.NR },
      { id: MethodId.PR },
      { id: MethodId.PIR },
    ]);
  }
}
