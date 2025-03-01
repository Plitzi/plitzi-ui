import { produce } from 'immer';
import get from 'lodash/get';
import set from 'lodash/set';
import { useState, useEffect, useCallback, useRef } from 'react';

function useLocalStorage<T extends object>(
  key: string,
  initialValue: T,
  metadata: { path?: string; mode: 'localStorage' | 'sessionStorage' } = { mode: 'localStorage' }
) {
  const { path, mode } = metadata;
  const storageRef = useRef(mode === 'localStorage' ? localStorage : sessionStorage);
  storageRef.current = mode === 'localStorage' ? localStorage : sessionStorage;

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
    (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue = event.newValue ? (JSON.parse(event.newValue) as T) : initialValue;
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

  // Sync external changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, path, initialValue, handleStorageChange]);

  return [value, setValue] as const;
}

export default useLocalStorage;
