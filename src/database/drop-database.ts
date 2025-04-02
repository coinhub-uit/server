import { dataSourceOptions } from 'src/common/database/options';
import { dropDatabase } from 'typeorm-extension';

async function drop() {
  await dropDatabase({ options: dataSourceOptions });
}

void drop();
