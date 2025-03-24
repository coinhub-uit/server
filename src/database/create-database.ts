import { dataSourceOptions } from 'src/common/database/options';
import { createDatabase } from 'typeorm-extension';

async function create() {
  console.log(dataSourceOptions.database);
  await createDatabase({ options: dataSourceOptions });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
create();
