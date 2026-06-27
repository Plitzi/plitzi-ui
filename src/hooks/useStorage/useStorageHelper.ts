const triggerEvent = (key: string, oldValue: string | null, newValue: string | null) => {
  if (process.env.NODE_ENV === 'test') {
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent('customstorage-changed', { detail: { key, oldValue, newValue } }));
    });
  } else {
    window.dispatchEvent(new CustomEvent('customstorage-changed', { detail: { key, oldValue, newValue } }));
  }
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readCookies = (): Record<string, string> => {
  const out: Record<string, string> = {};
  if (typeof document === 'undefined' || !document.cookie) {
    return out;
  }

  for (const part of document.cookie.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) {
      continue;
    }

    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
  }

  return out;
};

// Storage-shaped adapter over document.cookie so cookie-backed values travel to the server on every
// request (unlike localStorage). Wrapped by storageProxy to reuse the cross-instance sync events.
export const cookieStorage = (): Storage => {
  const api: Storage = {
    getItem(key: string): string | null {
      const cookies = readCookies();

      return key in cookies ? cookies[key] : null;
    },
    setItem(key: string, value: string): void {
      if (typeof document === 'undefined') {
        return;
      }

      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    },
    removeItem(key: string): void {
      if (typeof document === 'undefined') {
        return;
      }

      document.cookie = `${key}=; path=/; max-age=0; samesite=lax`;
    },
    clear(): void {
      for (const key of Object.keys(readCookies())) {
        api.removeItem(key);
      }
    },
    key(index: number): string | null {
      return Object.keys(readCookies())[index] ?? null;
    },
    get length(): number {
      return Object.keys(readCookies()).length;
    }
  };

  return api;
};

export const storageProxy = (storage: Storage) => {
  return new Proxy<Storage>(storage, {
    get(target, prop: string, receiver) {
      if (prop === 'setItem') {
        return (key: string, value: string) => {
          const oldValue = target.getItem(key);
          target.setItem.call(target, key, value);
          if (oldValue !== value) {
            triggerEvent(key, oldValue, value);
          }
        };
      }

      if (prop === 'removeItem') {
        return (key: string) => {
          const oldValue = target.getItem(key);
          target.removeItem.call(target, key);
          if (oldValue !== null) {
            triggerEvent(key, oldValue, null);
          }
        };
      }

      const value = Reflect.get(target, prop, receiver) as unknown;
      if (typeof value === 'function') {
        return (value as (...args: unknown[]) => unknown).bind(target);
      }

      return value;
    }
  });
};
