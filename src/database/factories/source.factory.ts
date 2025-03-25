import { setSeederFactory } from 'typeorm-extension';
import { SourceEntity } from 'src/source/entities/source.entity';

export default setSeederFactory(SourceEntity, async (faker) => {
  const source = new SourceEntity({
    id: faker.string.numeric({ length: 20, allowLeadingZeros: true }),
    balance: +faker.finance.amount({
      min: 0,
      max: 99999999,
      dec: 0,
    }),
  });
  return source;
});
