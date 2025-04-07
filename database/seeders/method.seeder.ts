import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { MethodEnum } from 'src/method/types/method.enum';

export default class MethodSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(MethodEntity);

    const methods = repository.create([
      { id: MethodEnum.NR },
      { id: MethodEnum.PR },
      { id: MethodEnum.PIR },
    ]);

    await repository.insert(methods);
  }
}
