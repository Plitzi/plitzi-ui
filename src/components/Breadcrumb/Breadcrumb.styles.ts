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
  listItem: cva('cursor-pointer', {
    variants: {
      intent: {
        primary:
          '[&:not(:last-child)]:text-primary-300 [&:not(:last-child)]:hover:text-primary-500 last:text-slate-500 dark:last:text-zinc-400 [&:not(:first-child)]:before:mx-3',
        secondary:
          '[&:not(:last-child)]:text-secondary-300 [&:not(:last-child)]:hover:text-secondary-500 last:text-slate-500 dark:last:text-zinc-400 [&:not(:first-child)]:before:mx-3'
      },
      intentSeparator: {
        primary: 'before:text-slate-500 dark:before:text-zinc-500',
        secondary: 'before:text-gray-500 dark:before:text-zinc-500'
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
