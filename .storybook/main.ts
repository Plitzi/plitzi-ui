import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src/components',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Components'
    }
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-styling-webpack'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  core: {
    disableTelemetry: true
  }
};

export default config;
