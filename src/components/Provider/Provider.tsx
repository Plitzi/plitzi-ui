import ThemeProvider from './providers/ThemeProvider';

import type { ThemeProviderProps } from './providers/ThemeProvider';
import type { ReactNode } from 'react';

export type ProviderProps = ThemeProviderProps & {
  children: ReactNode;
};

const Provider = ({ children, colors, components, sizes }: ProviderProps) => {
  return (
    <ThemeProvider colors={colors} components={components} sizes={sizes}>
      {children}
    </ThemeProvider>
  );
};

export default Provider;
