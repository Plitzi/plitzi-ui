/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce } from './debounce';

import type { DebouncedFunction, DebounceOptions } from './debounce';

export function throttle<F extends (...args: any[]) => any>(
  func: F,
  wait = 0,
  options: DebounceOptions = {}
): DebouncedFunction<F> {
  const leading = options.leading ?? true;
  const trailing = options.trailing ?? true;

  return debounce(func, wait, { leading, trailing, maxWait: wait });
}
