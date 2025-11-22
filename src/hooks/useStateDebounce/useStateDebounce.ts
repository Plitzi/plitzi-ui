/* eslint-disable react-hooks/refs */
import debounce from 'lodash-es/debounce.js';
import { useCallback, useMemo, useState, useRef } from 'react';

import { isFunction } from '@/helpers/utils';

import type { Dispatch, SetStateAction } from 'react';

const useStateDebounce = <T = unknown>(
  initialState: T,
  callback?: (state: T) => void,
  timeout: number = 250
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialState);
  const prevState = useRef(initialState);
  if (prevState.current !== initialState) {
    setState(initialState);
    prevState.current = initialState;
  }

  const callbackDebounced = useMemo(() => (callback ? debounce(callback, timeout) : undefined), [callback, timeout]);

  const setStateInternal = useCallback<Dispatch<SetStateAction<T>>>(
    (newState: T | ((state: T) => T)) => {
      if (isFunction(newState)) {
        setState((internalState: T) => {
          if (callbackDebounced) {
            callbackDebounced(newState(internalState));
          }

          return newState(internalState);
        });

        return;
      }

      setState(newState);
      if (callbackDebounced) {
        callbackDebounced(newState);
      }
    },
    [setState, callbackDebounced]
  );

  return [state, setStateInternal];
};

export default useStateDebounce;
