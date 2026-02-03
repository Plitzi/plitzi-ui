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
    'danger',
    'success',
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
        secondary: 'hover:text-secondary-200',
        secondaryActive: 'text-secondary-500',
        tertiary: 'hover:bg-grayviolet-200 text-gray-500',
        tertiaryActive: 'text-black',
        disabled: 'text-gray-400',
        danger: 'text-red-500 hover:text-red-400',
        success: 'text-green-500 hover:text-green-400',
        custom: ''
      },
      cursor: {
        pointer: 'cursor-pointer',
        disabled: 'cursor-not-allowed',
        custom: ''
      },
      size: {
        xs: 'text-xs w-3 h-3',
        sm: 'text-sm w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'text-lg w-4.5 h-4.5',
        xl: 'text-xl w-6 h-6',
        '2xl': 'text-2xl w-7 h-7',
        '3xl': 'text-3xl w-8 h-8',
        '4xl': 'text-4xl w-9 h-9',
        '5xl': 'text-5xl w-12 h-12',
        '6xl': 'text-6xl w-16 h-16',
        '7xl': 'text-7xl w-18 h-18',
        '8xl': 'text-8xl w-24 h-24',
        '9xl': 'text-9xl w-32 h-32',
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
