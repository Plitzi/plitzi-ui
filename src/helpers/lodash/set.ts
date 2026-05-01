import { isDangerousKey, toPath } from './shared';

import type { Path } from './shared';

export function set<T extends Record<string, unknown> | Record<string, unknown>[]>(
  obj: T,
  path: Path,
  value: unknown
): T {
  const keys = toPath(path);
  if (!keys.length) {
    return obj;
  }

  // SECURITY: defense-in-depth — toPath/validateSegment already reject __proto__/constructor/
  // prototype, but block again here in case `set` is called with pre-validated array paths
  // that bypass toPath. Prevents prototype pollution chain (KVInput, useStorage, useCache,
  // QueryBuilder all funnel here).
  for (const k of keys) {
    if (isDangerousKey(k)) {
      return obj;
    }
  }

  let current: unknown = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (current == null || typeof current !== 'object') {
      return obj;
    }

    const container = current as Record<string, unknown>;

    if (!Object.prototype.hasOwnProperty.call(container, key) || container[key] == null || typeof container[key] !== 'object') {
      container[key] = /^\d+$/.test(nextKey) ? [] : {};
    }

    current = container[key];
  }

  const lastKey = keys[keys.length - 1];

  if (current != null && typeof current === 'object') {
    const container = current as Record<string, unknown>;
    container[lastKey] = value;
  }

  return obj;
}
