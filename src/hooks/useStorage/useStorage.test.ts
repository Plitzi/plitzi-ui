/* eslint-disable @typescript-eslint/unbound-method */
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import useStorage from '.';

afterEach(() => {
  localStorage.clear();
});

type Cache = { viewMode: 'basic' | 'advanced'; collapsedCache: boolean };

// const [cache, setCache] = result.current;
describe('useStorage Tests', () => {
  it('basic functionality', async () => {
    const { result } = renderHook(() =>
      useStorage<Cache>('StyleInspector', { viewMode: 'basic', collapsedCache: false })
    );

    expect(result.current[0]).toEqual({ viewMode: 'basic', collapsedCache: false });

    act(() => {
      result.current[1]({ viewMode: 'advanced', collapsedCache: true });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true });
    });
  });

  it('basic multiple hooks at the same time', async () => {
    const { result } = renderHook(() =>
      useStorage<Cache>('StyleInspector', { viewMode: 'basic', collapsedCache: false })
    );
    const { result: result2 } = renderHook(() =>
      useStorage<Cache>('StyleInspector', { viewMode: 'basic', collapsedCache: false })
    );

    expect(result.current[0]).toEqual({ viewMode: 'basic', collapsedCache: false });

    act(() => {
      result.current[1]({ viewMode: 'advanced', collapsedCache: true });
    });

    await waitFor(
      () => {
        expect(result.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true });
        expect(result2.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true });
      },
      { timeout: 1000 }
    );
  });
});
