import { get } from './get';
import { set } from './set';

import type { Path } from './shared';

export function pick<T extends Record<string, unknown>, K extends keyof T & string>(
  obj: T,
  paths: K | readonly [K] | readonly K[]
): Pick<T, K>;

export function pick<T extends Record<string, unknown>>(obj: T, paths: Path | readonly Path[]): Partial<T>;

export function pick<T extends Record<string, unknown>>(obj: T, paths: Path | readonly Path[]): Partial<T> {
  const result: Partial<T> = {};
  const pathArray = Array.isArray(paths) ? paths : [paths];
  for (const path of pathArray) {
    const value = typeof path === 'string' ? get(obj, path) : get(obj, path);

    if (value !== undefined) {
      set(result as Record<string, unknown>, path as Path, value);
    }
  }

  return result;
}
