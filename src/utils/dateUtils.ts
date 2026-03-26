/**
 * Returns a date-only copy (time zeroed out) to avoid timezone drift in comparisons.
 */
export const toDateOnly = (d: Date): Date => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

/**
 * Add N calendar days to a date.
 */
export const addDays = (d: Date, n: number): Date => {
  const result = toDateOnly(d);
  result.setDate(result.getDate() + n);
  return result;
};

/**
 * Check if two dates represent the same calendar day.
 */
export const isSameDay = (a: Date, b: Date): boolean =>
  toDateOnly(a).toDateString() === toDateOnly(b).toDateString();

/**
 * Format a date in pt-BR long format: "quarta-feira, 26 de março de 2026"
 */
export const formatDateLong = (d: Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

/**
 * Format a date in pt-BR short format: "26/03/2026"
 */
export const formatDateShort = (d: Date): string =>
  new Intl.DateTimeFormat('pt-BR').format(d);

/**
 * Return the month name in pt-BR: "março"
 */
export const formatMonthName = (year: number, month: number): string =>
  new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1)
  );

/**
 * Return weekday short names in pt-BR starting on Sunday.
 */
export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Convert a yyyy-mm-dd input string to a local Date (avoids UTC offset issues).
 */
export const parseInputDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

/**
 * Convert a local Date to a yyyy-mm-dd string (for controlled date inputs).
 */
export const toInputValue = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
