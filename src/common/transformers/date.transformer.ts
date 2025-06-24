import { ValueTransformer } from 'typeorm';

export class DateTransformer implements ValueTransformer {
  to(date: Date) {
    return date.toISOString();
  }

  from(date: string) {
    return new Date(date);
  }
}

export function stringToDate({ value }: { value: string }): Date | null {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}
