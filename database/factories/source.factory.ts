import { setSeederFactory } from 'typeorm-extension';
import { SourceEntity } from 'src/source/entities/source.entity';
import Decimal from 'decimal.js';

export default setSeederFactory(SourceEntity, (faker) => {
  return new SourceEntity({
    id: faker.string.numeric({ length: 20, allowLeadingZeros: true }),
    balance: Decimal(
      faker.finance.amount({
        min: 0,
        max: 99999999,
        dec: 0,
      }),
    ),
  });
});
