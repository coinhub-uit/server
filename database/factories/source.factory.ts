import { setSeederFactory } from 'typeorm-extension';
import { SourceEntity } from 'src/source/entities/source.entity';
import { randomMoney } from 'lib/random-money';

export default setSeederFactory(SourceEntity, (faker) => {
  const source = new SourceEntity();
  source.id = faker.string.numeric(20);
  source.balance = randomMoney();
  return source;
});
