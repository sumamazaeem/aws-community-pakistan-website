/**
 * Date formatting for event pages.
 *
 * The existing pages write dates by hand and get it wrong in places -- the
 * national landing page says "22th Feb" and "20th Dec". Formatting from the
 * actual date in the content record removes that class of mistake.
 */

const LONG = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const DAY_MONTH = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export function formatDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return LONG.format(date);
}

/** "1 April to 20 May 2026", collapsing the year when both ends share it. */
export function formatDateRange(
  start: Date | null | undefined,
  end: Date | null | undefined,
): string | null {
  if (!start) return null;
  if (!end) return LONG.format(start);
  if (start.getTime() === end.getTime()) return LONG.format(start);

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const left = sameYear ? DAY_MONTH.format(start) : LONG.format(start);
  return `${left} to ${LONG.format(end)}`;
}

/** ISO yyyy-mm-dd, for <time datetime> and the "last updated" line. */
export function isoDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}
