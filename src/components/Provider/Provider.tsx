import ThemeProvider from './providers/ThemeProvider';

import type { ThemeProviderProps } from './providers/ThemeProvider';
import type { ReactNode } from 'react';

export type ProviderProps = ThemeProviderProps & {
  children: ReactNode;
};

const Provider = ({
  children,
  components,
  defaultColorMode,
  colorModeStorageKey,
  applyColorModeClass,
  colorModeRoot
}: ProviderProps) => {
  return (
    <ThemeProvider
      components={components}
      defaultColorMode={defaultColorMode}
      colorModeStorageKey={colorModeStorageKey}
      applyColorModeClass={applyColorModeClass}
      colorModeRoot={colorModeRoot}
    >
      {children}
    </ThemeProvider>
  );
};

export default Provider;
