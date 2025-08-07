import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import useReducerWithMiddleware from './useReducerWithMiddleware';

type State = { count: number };
type Action = { type: 'inc' } | { type: 'dec' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 };
    case 'dec':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

describe('useReducerWithMiddleware', () => {
  it('should initialize with initial state', () => {
    const { result } = renderHook(() => useReducerWithMiddleware(reducer, { count: 0 }));
    expect(result.current[0]).toEqual({ count: 0 });
  });

  it('should update state on dispatch', () => {
    const { result } = renderHook(() => useReducerWithMiddleware(reducer, { count: 0 }));
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: 'inc' });
    });

    expect(result.current[0]).toEqual({ count: 1 });

    act(() => {
      dispatch({ type: 'dec' });
    });

    expect(result.current[0]).toEqual({ count: 0 });
  });

  it('should call middleware on dispatch but not block reducer', () => {
    const middleware = vi.fn();
    const { result } = renderHook(() => useReducerWithMiddleware(reducer, { count: 0 }, [{ middleware }]));
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: 'inc' });
    });

    expect(middleware).toHaveBeenCalled();
    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('should pass correct arguments to middleware', () => {
    const middleware = vi.fn((prevState, newState, dispatchFn, action) => {
      expect(action).toEqual({ type: 'inc' });
      expect(prevState).toEqual({ count: 5 });
      expect(newState).toEqual({ count: 6 });
      expect(typeof dispatchFn).toBe('function');
    });
    const { result } = renderHook(() => useReducerWithMiddleware(reducer, { count: 5 }, [{ middleware }]));
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: 'inc' });
    });

    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('should respect typeFilter and filterCallback', () => {
    const middleware = vi.fn((prevState, newState, dispatchFn, action: { type: string }) => {
      expect(action).toEqual({ type: 'inc' });
      expect(prevState).toEqual({ count: 0 });
      expect(newState).toEqual({ count: 1 });
      expect(typeof dispatchFn).toBe('function');
    });
    const filterCallback = vi.fn((action: { type: string }) => action.type === 'inc');
    const { result } = renderHook(() =>
      useReducerWithMiddleware(reducer, { count: 0 }, [{ middleware, typeFilter: ['inc'], filterCallback }])
    );
    const [, dispatch] = result.current;

    act(() => {
      dispatch({ type: 'inc' });
    });
    act(() => {
      dispatch({ type: 'dec' });
    });

    expect(middleware).toHaveBeenCalledTimes(1);
    expect(filterCallback).toHaveBeenCalledTimes(2);
  });
});
