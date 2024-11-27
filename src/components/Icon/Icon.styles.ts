// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default'],
  size: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl']
} as const;

export const STYLES_COMPONENT_NAME = 'Icon';

export default {
  root: cva('flex items-center justify-center', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        xs: 'text-xs w-3 h-3',
        sm: 'text-sm w-[14px] h-[14px]',
        base: 'w-4 h-4',
        lg: 'text-lg w-5 h-5',
        xl: 'text-xl w-6 h-6',
        '2xl': 'text-2xl w-7 h-7',
        '3xl': 'text-3xl w-8 h-8',
        '4xl': 'text-4xl w-9 h-9',
        '5xl': 'text-5xl w-12 h-12',
        '6xl': 'text-6xl w-16 h-16',
        '7xl': 'text-7xl w-[72px] h-[72px]',
        '8xl': 'text-8xl w-[96px] h-[96px]',
        '9xl': 'text-9xl w-[128px] h-[128px]'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
