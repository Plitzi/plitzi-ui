/* eslint-disable react-hooks/refs */
import { useCallback, useRef, useState } from 'react';

import { isFunction } from '@/helpers/utils';
import { deepEqual } from '@/utils';

import type { DependencyList, Dispatch, SetStateAction } from 'react';

const useStateMemo = <T>(
  initialState: T | (() => T),
  deps: DependencyList = [],
  mode: 'soft' | 'hard' = 'soft'
): [T, Dispatch<SetStateAction<T>>] => {
  const [, setRefresh] = useState(0);
  const state = useRef(isFunction<T>(initialState) ? initialState() : initialState);
  const prevDepsRef = useRef<DependencyList>(deps);

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    if (isFunction<T>(newState)) {
      newState = newState(state.current);
    }

    if (state.current !== newState) {
      state.current = newState;
      setRefresh(Math.random());
    }
  }, []);

  if (!deepEqual(deps, prevDepsRef.current, mode)) {
    prevDepsRef.current = deps;
    state.current = isFunction<T>(initialState) ? initialState() : initialState;
  }

  return [state.current, setState];
};

export default useStateMemo;
