import { produce } from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { storageProxy } from './useStorageHelper';

function useLocalStorage<T = unknown>(
  keyProp: string,
  initialValue: T,
  mode: 'localStorage' | 'sessionStorage' = 'localStorage'
) {
  const [key, path] = useMemo(() => {
    if (keyProp.includes('.')) {
      const keyParts = keyProp.split('.').filter(Boolean);
      const keyRoot = keyParts.shift();

      return [keyRoot as string, keyParts.join('.')];
    }

    return [keyProp, ''];
  }, [keyProp]);

  const storageRef = useRef(mode === 'localStorage' ? storageProxy(localStorage) : storageProxy(sessionStorage));
  storageRef.current = mode === 'localStorage' ? storageProxy(localStorage) : storageProxy(sessionStorage);

  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = storageRef.current.getItem(key);
      if (!storedValue) {
        return initialValue;
      }

      const parsed = JSON.parse(storedValue) as Record<string, unknown>;
      return path ? (get(parsed, path, initialValue) as T) : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const storedValue = storageRef.current.getItem(key);
      let newState;
      if (!path) {
        newState = value;
      } else {
        newState = produce(storedValue ? JSON.parse(storedValue) : {}, (draft: object) => {
          set(draft, path, value);
        });
      }

      storageRef.current.setItem(key, JSON.stringify(newState));
    } catch {
      // Nothing here
    }
  }, [key, path, value]);

  const handleStorageChange = useCallback(
    (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? (JSON.parse(e.newValue) as T) : initialValue;
          if (path) {
            setValue(get(newValue, path, initialValue) as T);
          } else {
            setValue(newValue);
          }
        } catch {
          // Nothing here
        }
      }
    },
    [key, path, initialValue]
  );

  const handleCustomStorageChange = useCallback(
    (e: CustomEvent<{ key: string; oldValue: string | null; newValue: string | null }>) => {
      if (e.detail.key === key) {
        try {
          const newValue = e.detail.newValue ? (JSON.parse(e.detail.newValue) as T) : initialValue;
          setValue(path ? (get(newValue, path, initialValue) as T) : newValue);
        } catch {
          // Nothing here
        }
      }
    },
    [key, path, initialValue]
  );

  // Sync external changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localstorage-changed', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localstorage-changed', handleCustomStorageChange as EventListener);
    };
  }, [handleStorageChange, handleCustomStorageChange]);

  return [value, setValue] as const;
}

export default useLocalStorage;
