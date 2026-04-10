import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import resolveInitialColorMode from './helpers/resolveInitialColorMode';

import type { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export type ColorMode = 'light' | 'dark';
export type ColorModeDefaultValue = ColorMode | 'system';

export type ThemeContextValue = {
  theme: {
    components: {
      [componentName: string]: Record<string, ReturnType<typeof cva>>;
    };
  };
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
};

const ThemeDefault: ThemeContextValue = {
  theme: {
    components: {}
  },
  colorMode: 'light',
  toggleColorMode: () => {},
  setColorMode: () => {}
};

const ThemeContext = createContext<ThemeContextValue>(ThemeDefault);
ThemeContext.displayName = 'ThemeContext';

export type ThemeProviderProps = {
  children: ReactNode;
  components?: {
    [componentName: string]: Record<string, ReturnType<typeof cva>>;
  };
  defaultColorMode?: ColorModeDefaultValue;
  colorModeStorageKey?: string;
  applyColorModeClass?: boolean;
  colorModeRoot?: HTMLElement | null;
};

const ThemeProvider = ({
  children,
  components,
  defaultColorMode = 'light',
  colorModeStorageKey,
  applyColorModeClass = true,
  colorModeRoot
}: ThemeProviderProps) => {
  const isSystem = defaultColorMode === 'system';

  const [colorMode, setColorModeState] = useState<ColorMode>(() =>
    resolveInitialColorMode(colorModeStorageKey, defaultColorMode)
  );

  useEffect(() => {
    if (!isSystem || typeof window === 'undefined') {
      return;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setColorModeState(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);

    return () => {
      mq.removeEventListener('change', handler);
    };
  }, [isSystem]);

  useEffect(() => {
    if (!applyColorModeClass || typeof document === 'undefined') {
      return;
    }

    const root = colorModeRoot ?? document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorMode, applyColorModeClass, colorModeRoot]);

  const toggleColorMode = useCallback(() => {
    if (isSystem) {
      return;
    }

    setColorModeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (colorModeStorageKey) {
        try {
          localStorage.setItem(colorModeStorageKey, next);
        } catch {
          // ignore
        }
      }

      return next;
    });
  }, [isSystem, colorModeStorageKey]);

  const setColorMode = useCallback(
    (mode: ColorMode) => {
      if (isSystem) {
        return;
      }

      setColorModeState(mode);
      if (colorModeStorageKey) {
        try {
          localStorage.setItem(colorModeStorageKey, mode);
        } catch {
          // ignore
        }
      }
    },
    [isSystem, colorModeStorageKey]
  );

  const data = useMemo(
    () => ({
      theme: {
        components: components && Object.keys(components).length > 0 ? components : {}
      },
      colorMode,
      toggleColorMode,
      setColorMode
    }),
    [components, colorMode, toggleColorMode, setColorMode]
  );

  return <ThemeContext value={data}>{children}</ThemeContext>;
};

export { ThemeContext };

export default ThemeProvider;
