// Packages
import { useMemo } from 'react';

// Alias
import { emptyObject } from '@/helpers/utils';
import { paletteColors, tokenColors } from '@/tailwind/colors';

// Relatives
import ThemeContext from './ThemeContext';

export type ThemeProviderProps = {
  children: React.ReactNode;
  components?: {
    [componentName: string]: any;
  };
  colors?: {
    [color: string]: string;
  };
  sizes?: {
    [size: string]: string;
  };
};

const defaultThemeModules = import.meta.glob<{ default: any; STYLES_COMPONENT_NAME?: string }>('../../**/*.styles.ts', {
  eager: true
});

const defaultTheme = Object.keys(defaultThemeModules).reduce((acum: object, fileKey: string) => {
  const themeModule = defaultThemeModules?.[fileKey] ?? {};
  if (!themeModule?.STYLES_COMPONENT_NAME) {
    return acum;
  }

  return { ...acum, [themeModule.STYLES_COMPONENT_NAME]: themeModule.default };
}, {});

const ThemeProvider = ({
  children,
  components = defaultTheme,
  colors = emptyObject,
  sizes = emptyObject
}: ThemeProviderProps) => {
  const data = useMemo(
    () => ({
      theme: {
        components: { ...defaultTheme, ...components },
        colors: { ...colors, ...paletteColors, ...tokenColors },
        sizes: { ...sizes }
      }
    }),
    [colors, sizes, components]
  );

  return <ThemeContext value={data}>{children}</ThemeContext>;
};

export default ThemeProvider;
