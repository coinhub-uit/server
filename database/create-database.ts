import { getDataSourceOptions } from 'src/common/database/options';
import { createDatabase } from 'typeorm-extension';

async function create() {
  await createDatabase({ options: getDataSourceOptions()() });
}

void create();
