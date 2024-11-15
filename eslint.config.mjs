import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import storybook from 'eslint-plugin-storybook';

// const path = require('path');

export default tsEslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.env',
      'yarn-error.log',
      'coverage',
      '.yarn/*',
      '!.yarn/patches',
      '!.yarn/plugins',
      '!.yarn/releases',
      '!.yarn/sdks',
      '!.yarn/versions'
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      prettier,
      jsxRuntime: react.configs.flat['jsx-runtime'],
      storybook
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-var': 'error',
      indent: ['warn', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
      // semi: ['warn', 'never'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
      'prettier/prettier': ['warn', { trillingComma: 'none' }]
    }
  }
);
