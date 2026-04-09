import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'error', 'disabled'],
  size: ['md', 'sm', 'xs', 'custom'],
  selected: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Select2';

export default {
  root: cva('flex flex-col', {
    variants: {
      size: {
        md: 'gap-1.5',
        sm: 'gap-1 text-sm',
        xs: 'gap-1 text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  inputContainer: cva('flex items-center relative', {
    variants: {
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  trigger: cva('w-full'),
  placeholder: cva('text-zinc-400 dark:text-zinc-500 select-none'),
  searchInput: cva(''),
  list: cva('max-h-60 overflow-y-auto'),
  listPopup: cva('flex flex-col w-full', {
    variants: {
      size: {
        md: 'p-1.5',
        sm: 'p-1',
        xs: 'p-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  listPopupInner: cva('flex flex-col w-full'),
  listMessage: cva('text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0 py-3 text-sm'),
  listGroup: cva(
    '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-200 dark:[&:not(:last-child)]:border-zinc-700',
    {
      variants: {
        size: {
          md: '[&:not(:last-child)]:pb-1.5 not-last:mb-1.5',
          sm: '[&:not(:last-child)]:pb-1 not-last:mb-1',
          xs: '[&:not(:last-child)]:pb-1 not-last:mb-1',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'md'
      }
    }
  ),
  listGroupLabel: cva(
    'flex items-center cursor-default select-none truncate text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500',
    {
      variants: {
        size: {
          md: 'px-2.5 py-1.5 gap-2',
          sm: 'px-2 py-1 gap-1.5',
          xs: 'px-1.5 py-1 gap-1',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'md'
      }
    }
  ),
  listItem: cva(
    'group flex items-center justify-between shrink-0 transition-colors duration-100 cursor-pointer select-none rounded-md',
    {
      variants: {
        selected: {
          true: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
          false: 'text-zinc-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-700/60'
        },
        size: {
          md: 'px-2.5 py-2 gap-2 text-sm',
          sm: 'px-2 py-1.5 gap-1.5 text-sm',
          xs: 'px-1.5 py-1 gap-1 text-xs',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'md',
        selected: false
      }
    }
  ),
  listItemLabelContainer: cva('flex items-center min-w-0 truncate', {
    variants: {
      size: {
        md: 'gap-2',
        sm: 'gap-1.5',
        xs: 'gap-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  listItemIcon: cva('invisible group-hover:visible shrink-0 text-primary-ui')
};
