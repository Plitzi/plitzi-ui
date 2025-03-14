import { produce } from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';
import { useState, useEffect, useCallback, useRef } from 'react';

import { storageProxy } from './useStorageHelper';

function useLocalStorage<T extends object>(
  key: string,
  initialValue: T,
  metadata: { path?: string; mode: 'localStorage' | 'sessionStorage' } = { mode: 'localStorage', path: '' }
) {
  const { path, mode } = metadata;
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
      const newState = produce(storedValue ? JSON.parse(storedValue) : {}, (draft: T) => {
        if (path) {
          set(draft, path, value);
        } else {
          Object.assign(draft, value);
        }
      });
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
  }, [key, path, initialValue, handleStorageChange, handleCustomStorageChange]);

  return [value, setValue] as const;
}

export default useLocalStorage;
