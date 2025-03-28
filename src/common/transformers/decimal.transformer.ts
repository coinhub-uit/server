import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(decimal: Decimal): string {
    return decimal.toString();
  }

  from(decimal: string): Decimal {
    return new Decimal(decimal);
  }
}

export function decimalToString({ value }: { value: Decimal }): string {
  return value?.toFixed(0);
}
