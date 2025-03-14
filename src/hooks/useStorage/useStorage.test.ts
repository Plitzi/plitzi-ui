import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import useStorage from '.';

beforeEach(() => {
  localStorage.clear();
});

type Cache = { viewMode: 'basic' | 'advanced'; collapsedCache: boolean; nested?: { prop1: string } };

// const [cache, setCache] = result.current;
describe('useStorage Tests', () => {
  it.sequential('basic functionality', async () => {
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

  it.sequential('basic multiple hooks at the same time', async () => {
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

    await waitFor(() => {
      expect(result.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true });
      expect(result2.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true });
    });
  });

  it.sequential('complex scenario, multiple hooks, same object different levels', async () => {
    const { result } = renderHook(() =>
      useStorage<Cache>('StyleInspector', { viewMode: 'basic', collapsedCache: false, nested: { prop1: 'hello' } })
    );
    const { result: result2 } = renderHook(() =>
      useStorage<Cache['collapsedCache']>('StyleInspector.collapsedCache', false)
    );

    expect(result.current[0]).toEqual({ viewMode: 'basic', collapsedCache: false, nested: { prop1: 'hello' } });
    expect(result2.current[0]).toEqual(false);

    act(() => {
      result.current[1]({ viewMode: 'advanced', collapsedCache: true });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true });
      expect(result2.current[0]).toEqual(true);
    });

    act(() => {
      result2.current[1](false);
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: false });
      expect(result2.current[0]).toEqual(false);
    });

    act(() => {
      result.current[1]({ viewMode: 'advanced', collapsedCache: true, nested: { prop1: 'bye' } });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ viewMode: 'advanced', collapsedCache: true, nested: { prop1: 'bye' } });
      expect(result2.current[0]).toEqual(true);
    });
  });
});
