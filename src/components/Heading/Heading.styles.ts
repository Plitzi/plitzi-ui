// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  as: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
} as const;

export const STYLES_COMPONENT_NAME = 'Heading';

export default {
  root: cva('', {
    variants: {
      as: {
        h1: 'text-5xl font-extrabold',
        h2: 'text-4xl font-extrabold',
        h3: 'text-3xl font-bold',
        h4: 'text-2xl font-bold',
        h5: 'text-xl font-bold',
        h6: 'text-lg font-bold'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      as: 'h1'
    }
  })
};
