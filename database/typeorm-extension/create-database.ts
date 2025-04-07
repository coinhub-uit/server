import { dataSourceOptions } from 'src/common/database/options';
import { createDatabase } from 'typeorm-extension';

async function create() {
  await createDatabase({ options: dataSourceOptions });
}

void create();
