import { createElement } from 'react';

// Relatives
import ThemeProvider from '../src/components/ThemeProvider';

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
