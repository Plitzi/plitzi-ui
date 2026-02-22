/// <reference types="vite/client" />

import { createElement } from 'react';

import Provider from '../src/components/Provider';

import type { Preview } from '@storybook/react';

// Styles
import './styles.css';

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
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [Story => createElement(() => <Provider components={defaultTheme}>{createElement(Story)}</Provider>, {})]
};

export default preview;
