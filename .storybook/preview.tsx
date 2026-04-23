/// <reference types="vite/client" />

import { createElement, useEffect } from 'react';

import Provider from '../src/components/Provider';

import type { ColorMode } from '../src/components/Provider/providers/ThemeProvider';
import type { Preview } from '@storybook/react';

// Styles
import './styles.css';
import '../src/assets/scss/index.scss';

const defaultThemeModules = import.meta.glob<{ default: unknown; STYLES_COMPONENT_NAME?: string }>(
  '@components/**/*.styles.ts',
  { eager: true }
);

const defaultTheme = Object.keys(defaultThemeModules).reduce((acum: object, fileKey: string) => {
  const themeModule = defaultThemeModules[fileKey];
  if (!themeModule.STYLES_COMPONENT_NAME) {
    return acum;
  }

  return { ...acum, [themeModule.STYLES_COMPONENT_NAME]: themeModule.default };
}, {});

const preview: Preview = {
  globalTypes: {
    colorMode: {
      description: 'Color mode',
      toolbar: {
        title: 'Color mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    colorMode: 'light'
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story, context) => {
      const colorMode = (context.globals.colorMode ?? 'light') as ColorMode;

      return createElement(() => {
        useEffect(() => {
          const root = document.documentElement;
          if (colorMode === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }, []);

        return (
          <Provider components={defaultTheme} defaultColorMode={colorMode}>
            <div className={colorMode === 'dark' ? 'bg-zinc-900 min-h-screen p-4' : 'bg-white min-h-screen p-4'}>
              <Story />
            </div>
          </Provider>
        );
      }, {});
    }
  ]
};

export default preview;
