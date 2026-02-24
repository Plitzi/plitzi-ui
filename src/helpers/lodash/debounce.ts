/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
