import { createContext } from 'react';

export type ThemeContextValue = {
  theme: {
    components: {
      [componentName: string]: unknown;
    };
    colors: {
      [key: string]: string;
    };
    sizes: {
      [key: string]: string;
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

const ThemeContext = createContext<ThemeContextValue>(ThemeDefault);

export default ThemeContext;
