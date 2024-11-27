// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default'],
  size: ['xs', 'base', 'sm', 'xl']
} as const;

export const STYLES_COMPONENT_NAME = 'Icon';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: '',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
