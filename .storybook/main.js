const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const PACKAGE = require('../package.json');

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-controls'],
  core: {
    builder: 'webpack5'
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(c)ss$/,
        use: ['postcss-loader']
      }
    ];

    // Return the altered config
    return config;
  }
};
