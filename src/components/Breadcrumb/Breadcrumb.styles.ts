import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'custom'],
  intentSeparator: ['primary', 'secondary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Breadcrumb';

export default {
  root: cva('flex', {
    variants: {
      intent: {},
      size: {
        md: '',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  list: cva(''),
  listItem: cva('', {
    variants: {
      intent: {
        primary: '[&:not(:last-child)]:text-primary-300 last:text-slate-500 [&:not(:first-child)]:before:mx-3',
        secondary: '[&:not(:last-child)]:text-secondary-300 last:text-slate-500 [&:not(:first-child)]:before:mx-3'
      },
      intentSeparator: {
        primary: 'before:text-slate-500',
        secondary: 'before:text-gray-500'
      },
      size: {
        md: '',
        sm: '',
        xs: '',
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
