import { getDataSourceOptions } from 'src/common/database/options';
import { dropDatabase } from 'typeorm-extension';

async function drop() {
  await dropDatabase({ options: getDataSourceOptions() });
}

void drop();
