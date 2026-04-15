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
        primary: 'text-zinc-700 dark:text-zinc-300 hover:text-primary-ui',
        primaryActive: 'text-primary-ui',
        secondary: 'text-zinc-700 dark:text-zinc-300 hover:text-secondary-500 dark:hover:text-secondary-400',
        secondaryActive: 'text-secondary-500 dark:text-secondary-400',
        tertiary: 'hover:bg-grayviolet-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400',
        tertiaryActive: 'text-black dark:text-white',
        disabled: 'text-gray-400 dark:text-zinc-500',
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
        xs: 'text-xs',
        sm: 'text-sm',
        md: '',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl',
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
