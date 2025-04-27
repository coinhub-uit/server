import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';

export function randomMoney(): Decimal;
export function randomMoney(options: { min?: number; max?: number }): Decimal;

export function randomMoney(options?: { min?: number; max?: number }): Decimal {
  const { min = 0, max = 99999999 } = options || {};
  return Decimal(
    faker.finance.amount({
      min,
      max,
      dec: 0,
    }),
  );
}
