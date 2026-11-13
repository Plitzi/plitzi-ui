import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Breadcrumb';

export default {
  root: cva('flex gap-4', {
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
  listItem: cva('not-last:cursor-pointer select-none', {
    variants: {
      intent: {
        primary:
          'text-primary-ui hover:text-primary-text dark:not-last:text-primary-text dark:not-last:hover:text-primary-ui last:text-slate-500 dark:last:text-ui-fg-subtle',
        secondary:
          'text-secondary-500 hover:text-secondary-300 dark:not-last:text-secondary-300 dark:not-last:hover:text-secondary-500 last:text-slate-500 dark:last:text-ui-fg-subtle'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary'
    }
  }),
  separator: cva('', {
    variants: {
      intent: {
        primary: 'text-slate-500 dark:text-ui-fg-subtle',
        secondary: 'text-ui-fg-subtle'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary'
    }
  })
};
