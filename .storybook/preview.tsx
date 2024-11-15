// Packages
import { createElement } from 'react';

// Alias
import ThemeProvider from '../src/components/ThemeProvider'

// Relatives

// Types
import type { Preview } from '@storybook/react';

// Styles
import './styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [Story => createElement(ThemeProvider, { children: createElement(Story) })]
};

export default preview;
