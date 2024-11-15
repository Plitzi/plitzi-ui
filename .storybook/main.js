module.exports = {
  stories: [
    {
      directory: '../src/components/**',
      files: '*.stories.*',
      titlePrefix: 'Components'
    }
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
};
