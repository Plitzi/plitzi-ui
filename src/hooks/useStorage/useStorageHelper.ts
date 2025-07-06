const triggerEvent = (key: string, oldValue: string | null, newValue: string | null) => {
  if (process.env.NODE_ENV === 'test') {
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent('customstorage-changed', { detail: { key, oldValue, newValue } }));
    });
  } else {
    window.dispatchEvent(new CustomEvent('customstorage-changed', { detail: { key, oldValue, newValue } }));
  }
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
