/* eslint-disable react-hooks/refs */
import { produce } from 'immer';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import { get, set } from '@/helpers/lodash';
import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import { storageProxy } from './useStorageHelper';

function useLocalStorage<T = unknown>(
  keyProp: string,
  initialValue: T,
  mode: 'localStorage' | 'sessionStorage' = 'localStorage',
  autoSync: boolean = true
) {
  const [key, path] = useMemo(() => {
    if (keyProp.includes('.')) {
      const keyParts = keyProp.split('.').filter(Boolean);
      const keyRoot = keyParts.shift();

      return [keyRoot as string, keyParts.join('.')];
    }

    return [keyProp, ''];
  }, [keyProp]);

  const storageRef = useRef<Storage | undefined>(
    mode === 'localStorage'
      ? typeof localStorage !== 'undefined'
        ? storageProxy(localStorage)
        : undefined
      : typeof sessionStorage !== 'undefined'
        ? storageProxy(sessionStorage)
        : undefined
  );

  useDidUpdateEffect(() => {
    if (
      (mode === 'localStorage' && typeof localStorage === 'undefined') ||
      (mode === 'sessionStorage' && typeof sessionStorage === 'undefined')
    ) {
      storageRef.current = undefined;

      return;
    }

    storageRef.current = mode === 'localStorage' ? storageProxy(localStorage) : storageProxy(sessionStorage);
  }, [mode]);

  const [value, setValue] = useState<T>(() => {
    try {
      if (!storageRef.current) {
        return initialValue;
      }

      const storedValue = storageRef.current.getItem(key);
      if (!storedValue) {
        return initialValue;
      }

      const parsed = JSON.parse(storedValue) as Record<string, unknown>;
      return path ? get(parsed, path, initialValue) : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (!storageRef.current) {
        return;
      }

      let newState: unknown = value;
      if (path) {
        const storedValue = storageRef.current.getItem(key);
        newState = produce(storedValue ? JSON.parse(storedValue) : {}, (draft: object) => {
          set(draft as Record<string, unknown>, path, value);
        });
      }

      storageRef.current.setItem(key, JSON.stringify(newState));
    } catch (err) {
      console.log((err as Error).message);
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
    if (typeof window === 'undefined' || !autoSync) {
      return;
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customstorage-changed', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customstorage-changed', handleCustomStorageChange as EventListener);
    };
  }, [handleStorageChange, handleCustomStorageChange, mode, autoSync]);

  return [value, setValue] as const;
}

export default useLocalStorage;
