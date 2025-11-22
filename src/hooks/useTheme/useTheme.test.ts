import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@components/Provider';

import useTheme from './useTheme';

// import type buttonStyles from '@components/Button/Button.styles';
// import type { variantKeys as buttonVariantKeys } from '@components/Button/Button.styles';
import type dummyStyles from '@components/Dummy/Dummy.styles';
import type { variantKeys as dummyVariantKeys } from '@components/Dummy/Dummy.styles';

describe('useTheme', () => {
  it('should return empty string on empty className on intent and className', () => {
    const { result } = renderHook(
      () =>
        useTheme<typeof dummyStyles, typeof dummyVariantKeys>('Dummy', {
          className: '',
          componentKey: 'root',
          variants: { intent: 'default' }
        }),
      { wrapper: ThemeProvider }
    );
    expect(result.current).toEqual('');
  });

  it('should return className although intent is empty', () => {
    const { result } = renderHook(
      () =>
        useTheme<typeof dummyStyles, typeof dummyVariantKeys>('Dummy', {
          className: 'text-red-500',
          componentKey: 'root',
          variants: { intent: 'default' }
        }),
      { wrapper: ThemeProvider }
    );
    expect(result.current).toEqual('text-red-500');
  });

  it('should return the correct variant of intent on danger', () => {
    const { result } = renderHook(
      () =>
        useTheme<typeof dummyStyles, typeof dummyVariantKeys>('Dummy', {
          className: 'text-red-500',
          componentKey: 'root',
          variants: { intent: 'danger' }
        }),
      { wrapper: ThemeProvider }
    );
    expect(result.current).toEqual('text-red-500');
  });

  it('should allow prioritize clsx that comes from props', () => {
    const { result } = renderHook(
      () =>
        useTheme<typeof dummyStyles, typeof dummyVariantKeys>('Dummy', {
          className: 'text-red-500',
          componentKey: 'root',
          variants: { intent: 'danger' }
        }),
      { wrapper: ThemeProvider }
    );
    expect(result.current).toEqual('text-red-500');
  });

  it('componentKey string and className as object', () => {
    const { result } = renderHook(
      () =>
        useTheme<typeof dummyStyles, typeof dummyVariantKeys>('Dummy', {
          className: { root: 'text-red-500' },
          componentKey: 'root',
          variants: { intent: 'danger' }
        }),
      { wrapper: ThemeProvider }
    );
    expect(result.current).toEqual('text-red-500');
  });

  it('componentName array and componentKey as string', () => {
    const { result } = renderHook(
      () =>
        useTheme<typeof dummyStyles, typeof dummyVariantKeys>(['Dummy', 'Dummy'], {
          className: 'text-red-500',
          componentKey: 'root',
          variants: { intent: 'danger' }
        }),
      { wrapper: ThemeProvider }
    );

    expect(result.current).toEqual('text-red-500');
  });
});
