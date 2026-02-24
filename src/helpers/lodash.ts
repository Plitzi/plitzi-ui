/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-dynamic-delete */

// Types

export type Path = string | readonly (string | number)[];

// Helpers

const PATH_REGEX = /[^.[\]]+/g;

export function toPath(path: Path): string[] {
  if (typeof path === 'string') {
    return path.match(PATH_REGEX) ?? [];
  }

  // path is readonly (string | number)[]
  const result = new Array(path.length) as string[];
  for (let i = 0; i < path.length; i++) {
    result[i] = String(path[i]);
  }

  return result;
}

// Get

type Split<S extends string, Delimiter extends string> = S extends `${infer T}${Delimiter}${infer U}`
  ? [T, ...Split<U, Delimiter>]
  : S extends ''
    ? []
    : [S];

type NormalizeArrayPath<S extends string> = S extends `[${infer B}]${infer C}`
  ? NormalizeArrayPath<`${B}${C}`>
  : S extends `${infer A}[${infer B}]${infer C}`
    ? NormalizeArrayPath<`${A}.${B}${C}`>
    : S;

type PathArray<S extends string> = Split<NormalizeArrayPath<S>, '.'>;

type DeepValue<T, Keys extends readonly string[]> = Keys extends []
  ? T
  : Keys extends [infer K, ...infer Rest]
    ? K extends string
      ? K extends `${number}`
        ? T extends readonly (infer U)[]
          ? Rest extends readonly string[]
            ? DeepValue<U, Rest>
            : U
          : unknown
        : K extends keyof T
          ? Rest extends readonly string[]
            ? DeepValue<T[K], Rest>
            : T[K]
          : unknown
      : unknown
    : unknown;

export function get<T, P extends string, TDefault = undefined>(
  obj: T,
  path: P,
  defaultValue?: TDefault
): DeepValue<NonNullable<T>, PathArray<P>> | TDefault;

export function get<T, TDefault = undefined>(
  obj: T,
  path: Exclude<Path, string>,
  defaultValue?: TDefault
): Partial<T> | TDefault;

export function get(obj: unknown, path: Path, defaultValue?: unknown) {
  if (obj == null || path === '') {
    return defaultValue;
  }

  const keys = toPath(path);
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }

    if (Array.isArray(current)) {
      const index = Number(key);
      current = current[index];
    } else {
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current === undefined ? defaultValue : current;
}

export function set<T extends Record<string, unknown> | Record<string, unknown>[]>(
  obj: T,
  path: Path,
  value: unknown
): T {
  const keys = toPath(path);
  if (!keys.length) {
    return obj;
  }

  let current: unknown = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (current == null || typeof current !== 'object') {
      return obj;
    }

    const container = current as Record<string, unknown>;

    if (container[key] == null || typeof container[key] !== 'object') {
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

// Pick

// precise top-level key or array with one or more top-level keys
export function pick<T extends Record<string, unknown>, K extends keyof T & string>(
  obj: T,
  paths: K | readonly [K] | readonly K[]
): Pick<T, K>;

// fallback for nested paths or dynamic strings
export function pick<T extends Record<string, unknown>>(obj: T, paths: Path | readonly Path[]): Partial<T>;

// Updated pick function implementation
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

// Omit

export function omit<T extends Record<string, unknown>, P extends Path>(obj: T, paths: P | readonly P[]): Partial<T> {
  const clone = structuredClone(obj);
  const pathArray: readonly P[] = Array.isArray(paths) ? paths : [paths];
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

// Debounce

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export type DebouncedFunction<F extends (...args: any[]) => any> = {
  (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined;
  cancel: () => void;
  flush: () => ReturnType<F> | undefined;
  pending: () => boolean;
};

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait = 0,
  options: DebounceOptions = {}
): DebouncedFunction<F> {
  let lastArgs: Parameters<F> | undefined;
  let lastThis: ThisParameterType<F> | undefined;
  let result: ReturnType<F> | undefined;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;

  const leading = options.leading ?? false;
  const trailing = options.trailing ?? true;
  const maxWait = options.maxWait;

  const now = () => Date.now();

  function invoke(time: number) {
    if (!lastArgs) {
      return result;
    }

    lastInvokeTime = time;
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = undefined;
    lastThis = undefined;

    result = func.apply(thisArg, args);

    return result;
  }

  function startTimer(pendingWait: number) {
    timerId = setTimeout(timerExpired, pendingWait);
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time: number) {
    if (lastCallTime === undefined) {
      return true;
    }

    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    startTimer(remainingWait(time));
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    startTimer(wait);

    return leading ? invoke(time) : result;
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invoke(time);
    }

    lastArgs = lastThis = undefined;

    return result;
  }

  function debounced(this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined {
    const time = now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (!timerId) {
        return leadingEdge(time);
      }

      if (maxWait !== undefined) {
        clearTimeout(timerId);
        startTimer(wait);

        return invoke(time);
      }
    }

    if (!timerId) {
      startTimer(wait);
    }

    return result;
  }

  debounced.cancel = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  };

  debounced.flush = () => {
    return timerId === undefined ? result : trailingEdge(now());
  };

  debounced.pending = () => timerId !== undefined;

  return debounced as DebouncedFunction<F>;
}
