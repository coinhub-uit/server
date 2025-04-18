export function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthDifference(start: Date, end: Date) {
  return (
    Math.abs(end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

export function dateAfter(startDate: Date, days: number) {
  const endDate = new Date().setDate(startDate.getDate() + days);
  return endDate;
}
