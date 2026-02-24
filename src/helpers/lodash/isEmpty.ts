/* eslint-disable @typescript-eslint/no-explicit-any */

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'function' ||
    typeof value === 'symbol'
  ) {
    return false;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0;
  }

  return false;
}
