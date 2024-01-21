export function getWeekOfYear(date: Date) {
  const year = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - year.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + days) / 7);
}