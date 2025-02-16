import plugin from 'tailwindcss/plugin';
import { join } from 'path';

// Relatives
import colorsUI from './src/tailwind/colors';

export default {
  darkMode: 'class',
  content: [
    // join(__dirname, "src/**/!(*.stories|*.spec).{js,html}")
    join(__dirname, 'src/**/*.{js,html,ts,tsx,mdx}')
  ],
  theme: {
    extend: {
      colors: colorsUI
    }
  },
  plugins: [
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
