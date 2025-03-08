import { createElement } from 'react';

import Provider from '../src/components/Provider';

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
  decorators: [Story => createElement(Provider, { children: createElement(Story) })]
};

export default preview;
