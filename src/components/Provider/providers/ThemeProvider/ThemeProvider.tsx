/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo } from 'react';

import type { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

export type ThemeContextValue = {
  theme: {
    components: {
      [componentName: string]: Record<string, ReturnType<typeof cva>>;
    };
  };
};

const ThemeDefault = {
  theme: {
    components: {},
    colors: {},
    sizes: {}
  }
};

export const ThemeContext = createContext<ThemeContextValue>(ThemeDefault);

export type ThemeProviderProps = {
  children: ReactNode;
  components?: {
    [componentName: string]: Record<string, ReturnType<typeof cva>>;
  };
};

const ThemeProvider = ({ children, components }: ThemeProviderProps) => {
  const data = useMemo(() => {
    if (!components || Object.keys(components).length === 0) {
      return {
        theme: { components: {}, colors: {}, sizes: {} }
      };
    }

    return {
      theme: {
        components
      }
    };
  }, [components]);

  return <ThemeContext value={data}>{children}</ThemeContext>;
};

export default ThemeProvider;
