const DATE_FORMATTER = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function toIsoString(date: Date = new Date()): string {
  return date.toISOString();
}

export function getTodayKey(date: Date = new Date()): string {
  return DATE_FORMATTER.format(date);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}
