const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const { join } = require('path');
const { paletteColors, tokenColors } = require('./src/tailwind/colors');

module.exports = {
  darkMode: 'class',
  content: [
    // join(__dirname, "src/**/!(*.stories|*.spec).{js,html}")
    join(__dirname, 'src/**/*.{js,html,ts,tsx,mdx}')
  ],
  theme: {
    extend: {
      colors: { ...paletteColors, ...tokenColors }
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      rubik: ['Rubik', 'sans-serif']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addVariant, e }) {
      addVariant('not-first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not-first${separator}${className}`)}:not(:first-child)`;
        });
      });
    }),
    plugin(function ({ addVariant, e }) {
      addVariant('not-last', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`not-last${separator}${className}`)}:not(:last-child)`;
        });
      });
    }),
    plugin(({ addVariant, theme }) => {
      const groups = theme('groups') || [];

      groups.forEach(group => {
        addVariant(`group-${group}-hover`, () => {
          return `:merge(.group-${group}):hover &`;
        });
      });
    })
  ]
};
