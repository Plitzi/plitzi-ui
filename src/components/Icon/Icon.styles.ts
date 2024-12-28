// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: [
    'primary',
    'primaryActive',
    'secondary',
    'secondaryActive',
    'tertiary',
    'tertiaryActive',
    'disabled',
    'error',
    'custom'
  ],
  cursor: ['pointer', 'disabled', 'custom'],
  size: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Icon';

export default {
  root: cva('flex items-center justify-center', {
    variants: {
      intent: {
        primary: 'hover:text-primary-200',
        primaryActive: 'text-primary-500',
        secondary: 'hover:text-primary-200',
        secondaryActive: 'text-primary-500',
        tertiary: 'hover:bg-grayviolet-200 text-gray-500',
        tertiaryActive: 'bg-grayviolet-200 text-black',
        disabled: 'text-gray-400',
        error: 'text-red-500 hover:text-red-400',
        custom: ''
      },
      cursor: {
        pointer: 'cursor-pointer',
        disabled: 'cursor-not-allowed',
        custom: ''
      },
      size: {
        xs: 'text-xs min-w-3 min-h-3',
        sm: 'text-sm min-w-[14px] min-h-[14px]',
        md: 'min-w-4 min-h-4',
        lg: 'text-lg min-w-[18px] min-h-[18px]',
        xl: 'text-xl min-w-6 min-h-6',
        '2xl': 'text-2xl min-w-7 min-h-7',
        '3xl': 'text-3xl min-w-8 min-h-8',
        '4xl': 'text-4xl min-w-9 min-h-9',
        '5xl': 'text-5xl min-w-12 min-h-12',
        '6xl': 'text-6xl min-w-16 min-h-16',
        '7xl': 'text-7xl min-w-[72px] min-h-[72px]',
        '8xl': 'text-8xl min-w-[96px] min-h-[96px]',
        '9xl': 'text-9xl min-w-[128px] min-h-[128px]',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  })
};
