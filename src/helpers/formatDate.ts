import { parseISO, getTime, isValid, parse } from 'date-fns';

export const toUnixSeconds = (input: string | number | Date): string => {
  let d: Date;

  // Normaliza igual que tu parseDate
  if (typeof input === 'number') {
    d = input < 1e12 ? new Date(input * 1000) : new Date(input);
  } else if (typeof input === 'string') {
    d = parseISO(input);
  } else {
    d = input;
  }

  // getTime() → ms
  return Math.floor(getTime(d) / 1000).toString();
};

export const isDate = (value: unknown): value is Date => {
  if (typeof value !== 'string') {
    return false;
  }

  // Strict regex: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  // Parse explicitly using the same format
  const date = parse(value, 'yyyy-MM-dd', new Date());

  // Check if the parsed date is valid
  return isValid(date);
};
