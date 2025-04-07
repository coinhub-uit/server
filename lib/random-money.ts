import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';

export function randomMoney() {
  return Decimal(
    faker.finance.amount({
      min: 0,
      max: 99999999,
      dec: 0,
    }),
  );
}
