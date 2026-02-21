import ThemeProvider from './providers/ThemeProvider';

import type { ThemeProviderProps } from './providers/ThemeProvider';
import type { ReactNode } from 'react';

export type ProviderProps = ThemeProviderProps & {
  children: ReactNode;
};

const Provider = ({ children, components }: ProviderProps) => {
  return <ThemeProvider components={components}>{children}</ThemeProvider>;
};

export default Provider;
