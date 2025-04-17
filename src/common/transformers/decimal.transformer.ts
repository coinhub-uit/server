import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(decimal?: Decimal): string {
    if (!decimal) {
      throw new Error('Decimal is not defined');
    }
    return decimal.toString();
  }

  from(decimal: string): Decimal {
    return new Decimal(decimal);
  }
}

export function decimalToString({ value }: { value: Decimal }): string {
  return value?.toFixed(0);
}
