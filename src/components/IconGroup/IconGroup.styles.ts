// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'active', 'disabled', 'custom'],
  size: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', 'custom'],
  direction: ['column', 'row', 'row-reverse', 'col-reverse']
} as const;

export const STYLES_COMPONENT_NAME = 'IconGroup';

export default {
  root: cva('rounded-lg bg-grayviolet-200', {
    variants: {
      intent: {
        primary: '',
        active: '',
        disabled: '',
        custom: ''
      },
      size: {
        xs: 'px-1.5 py-1',
        sm: 'px-2 py-1.5',
        md: 'px-2.5 py-2',
        lg: 'px-2.5 py-2',
        xl: 'px-2.5 py-2',
        '2xl': 'px-3 py-2',
        '3xl': 'px-3 py-2',
        '4xl': 'px-3 py-2',
        '5xl': 'px-3 py-2',
        '6xl': 'px-3 py-2',
        '7xl': 'px-3 py-2',
        '8xl': 'px-3 py-2',
        '9xl': 'px-3 py-2',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  separator: cva('bg-gray-500', {
    variants: {
      intent: {
        default: ''
      },
      direction: {
        column: 'w-full',
        row: 'h-full',
        'row-reverse': 'h-full',
        'col-reverse': 'w-full'
      }
    },
    compoundVariants: [
      {
        direction: 'column',
        className: 'h-px'
      },
      {
        direction: 'col-reverse',
        className: 'h-px'
      },
      {
        direction: 'row',
        className: 'w-px'
      },
      {
        direction: 'row-reverse',
        className: 'w-px'
      }
    ],
    defaultVariants: {
      intent: 'default',
      direction: 'row'
    }
  }),
  icon: cva('')
};
