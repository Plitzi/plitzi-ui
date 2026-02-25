/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { cloneAtPath } from './cloneDeep';
import { toPath } from './shared';

import type { Path } from './shared';

export function omit<T extends object>(obj: T): T;

export function omit<T extends Record<string, unknown>, K extends keyof T & string>(
  obj: T,
  paths: K | readonly [K] | readonly K[]
): Omit<T, K>;

export function omit<T extends Record<string, unknown>>(obj: T, paths: Path | readonly Path[]): Partial<T>;

export function omit<T extends Record<string, unknown>>(obj: T, paths?: Path | readonly Path[]): Partial<T> {
  const pathArray: readonly Path[] = Array.isArray(paths) ? paths : paths ? [paths] : [];
  if (pathArray.length === 0) {
    return { ...obj };
  }
  let result: T = obj;

  for (const path of pathArray) {
    const keys = toPath(path);
    if (!keys.length) {
      continue;
    }

    const clonedRoot = cloneAtPath(result, path);
    let current: unknown = clonedRoot;
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

    result = clonedRoot;
  }

  return result;
}
