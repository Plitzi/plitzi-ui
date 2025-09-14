import { useCallback, useReducer, useRef } from 'react';

import useValueMemo from '@hooks/useValueMemo';

import type { DeepEqualMetadata } from '@/utils';
import type { ActionDispatch, AnyActionArg } from 'react';

export type ReducerMiddlewareCallback<S, A extends AnyActionArg> = (
  prevState: S,
  state: S,
  dispatch: ActionDispatch<A>,
  ...args: A
) => void;

export type ReducerFilterCallback<A extends AnyActionArg> = (...args: A) => boolean;

const useReducerWithMiddleware = <S, A extends AnyActionArg>(
  reducer: (prevState: S, ...args: A) => S,
  initialState: S,
  middlewares: {
    middleware?: ReducerMiddlewareCallback<S, A>;
    typeFilter?: string[];
    filterCallback?: ReducerFilterCallback<A>;
  }[] = [],
  middlewaresDeepEqualMode?: 'soft' | 'hard',
  middlewaresDeepEqualMetadata: DeepEqualMetadata = { skipFunctions: true }
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const middlewaresMemo = useValueMemo(middlewares, middlewaresDeepEqualMode, middlewaresDeepEqualMetadata);
  const stateRef = useRef(state);
  stateRef.current = state;

  const dispatchWithMiddleware = useCallback(
    (...action: A) => {
      if (middlewaresMemo.length > 0) {
        const newState = reducer(stateRef.current, ...action);
        middlewaresMemo.forEach(({ middleware, typeFilter = [], filterCallback }) => {
          const filterCallbackResult =
            !filterCallback || (typeof filterCallback === 'function' && filterCallback(...action));
          if (
            middleware &&
            filterCallbackResult &&
            (!Array.isArray(typeFilter) ||
              typeFilter.length === 0 ||
              typeFilter.includes((action[0] as { type: string }).type))
          ) {
            middleware(stateRef.current, newState, dispatchWithMiddleware, ...action);
          }
        });
      }

      dispatch(...action);
    },
    [reducer, middlewaresMemo]
  );

  return [state, dispatchWithMiddleware] as [S, ActionDispatch<A>];
};

export default useReducerWithMiddleware;
