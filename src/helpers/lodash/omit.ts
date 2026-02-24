/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { toPath } from './shared';

import type { Path } from './shared';

export function omit<T extends Record<string, unknown>, K extends keyof T & string>(
  obj: T,
  paths: K | readonly [K] | readonly K[]
): Omit<T, K>;

export function omit<T extends Record<string, unknown>>(obj: T, paths: Path | readonly Path[]): Partial<T>;

export function omit<T extends Record<string, unknown>>(obj: T, paths: Path | readonly Path[]): Partial<T> {
  const clone = structuredClone(obj);
  const pathArray: readonly Path[] = Array.isArray(paths) ? paths : [paths];
  for (const path of pathArray) {
    const keys = toPath(path);
    if (!keys.length) {
      continue;
    }

    let current: unknown = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current || typeof current !== 'object') {
        break;
      }
      const k = keys[i];
      current = (current as Record<string, unknown>)[k];
    }

    if (current && typeof current === 'object') {
      const keyToDelete = keys[keys.length - 1];
      if (Object.prototype.hasOwnProperty.call(current, keyToDelete)) {
        delete (current as Record<string, unknown>)[keyToDelete];
      }
    }
  }

  return clone;
}
