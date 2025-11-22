import { produce } from 'immer';
import get from 'lodash-es/get.js';
import set from 'lodash-es/set.js';
import { useCallback, use, useMemo, useState } from 'react';

import CacheContext from '../CacheContext';

import type { CacheContextValue } from '../CacheContext';

export type UseCacheProps = {
  storeMode?: 'local' | 'session';
  skipContext?: boolean;
  cacheId?: string;
};

export type UseCacheReturn<T = unknown> = [
  Record<string, T> | T, // internalCache
  (value: Record<string, T>, path?: string) => boolean, // setCache
  (path?: string, defaultValue?: Record<string, T>) => Record<string, T> | T, // getCache
  () => void // clearCache
];

const useCache = <T = unknown>({
  storeMode = 'local',
  skipContext = false,
  cacheId = ''
}: UseCacheProps = {}): UseCacheReturn<T> => {
  const [reRender, setReRender] = useState(false);
  const context = use(CacheContext) as CacheContextValue | undefined;
  if (context === undefined && !skipContext) {
    throw new Error('CacheContext value is undefined. Make sure you use the CacheProvider before using the hook.');
  } else if (context && !skipContext) {
    ({ cacheId } = context);
  }

  if (!cacheId) {
    throw new Error('cacheId is empty.');
  }

  const getCache = useCallback(
    (path?: string, defaultValue: Record<string, T> = {}) => {
      let serializedState: Record<string, T> | string | null = defaultValue;
      try {
        if (storeMode === 'local') {
          serializedState = localStorage.getItem(cacheId);
        } else {
          serializedState = sessionStorage.getItem(cacheId);
        }

        if (typeof serializedState === 'string') {
          serializedState = JSON.parse(serializedState) as Record<string, T>;
        }
      } catch {
        serializedState = defaultValue;
      }

      if (!path) {
        return serializedState as Record<string, T>;
      }

      return get(serializedState, path, defaultValue);
    },
    [cacheId, storeMode]
  );

  const setCache = useCallback(
    (value: Record<string, T>, path = '') => {
      const currentState = getCache() as Record<string, T>;
      let newState = currentState;
      if (path) {
        newState = produce(currentState, draft => {
          set(draft, path, value);
        });
      } else {
        newState = value;
      }

      try {
        const serializedState = JSON.stringify(newState);
        if (storeMode === 'local') {
          localStorage.setItem(cacheId, serializedState);
        } else {
          sessionStorage.setItem(cacheId, serializedState);
        }
      } catch {
        return false;
      }

      setReRender(state => !state);

      return true;
    },
    [cacheId, getCache, storeMode]
  );

  const clearCache = useCallback(() => {
    try {
      if (storeMode === 'local') {
        localStorage.removeItem(cacheId);
      } else {
        sessionStorage.removeItem(cacheId);
      }
    } catch {
      // Nothing to do here
    }

    setReRender(state => !state);
  }, [cacheId, storeMode]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const internalCache = useMemo(() => getCache(), [reRender]);

  return [internalCache, setCache, getCache, clearCache];
};

export default useCache;
