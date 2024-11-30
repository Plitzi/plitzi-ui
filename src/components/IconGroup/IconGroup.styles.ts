// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'active', 'disabled', 'custom'],
  size: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', 'custom'],
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
        xs: 'px-1 py-0.5',
        sm: 'px-1.5 py-0.5',
        base: 'px-2 py-1',
        lg: 'px-2 py-1',
        xl: 'px-2 py-1',
        '2xl': 'px-2 py-1',
        '3xl': 'px-2 py-1',
        '4xl': 'px-2 py-1',
        '5xl': 'px-2 py-1',
        '6xl': 'px-2 py-1',
        '7xl': 'px-2 py-1',
        '8xl': 'px-2 py-1',
        '9xl': 'px-2 py-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'base'
    }
  }),
  separator: cva('bg-gray-300', {
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
