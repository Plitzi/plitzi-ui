import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'error', 'disabled'],
  size: ['md', 'sm', 'xs', 'custom'],
  selected: [true, false],
  disabled: [true, false]
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
  placeholder: cva('text-ui-fg-subtle select-none'),
  value: cva('text-ui-fg'),
  searchInput: cva(''),
  list: cva('max-h-60 overflow-y-auto'),
  listPopup: cva('flex flex-col w-full', {
    variants: {
      size: {
        md: 'p-1.5 gap-2',
        sm: 'p-1 gap-1.5',
        xs: 'p-1 gap-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  listPopupInner: cva('flex flex-col w-full', {
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
  listMessage: cva('text-ui-fg-subtle flex items-center justify-center shrink-0', {
    variants: {
      size: {
        md: 'py-2',
        sm: 'py-1.5 text-sm',
        xs: 'py-1 text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  listGroup: cva(
    '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-ui-line dark:[&:not(:last-child)]:border-ui-line-strong',
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
    'flex items-center cursor-default select-none truncate text-xs font-semibold uppercase tracking-wide text-ui-fg-subtle',
    {
      variants: {
        disabled: {
          true: 'text-ui-fg-subtle opacity-50',
          false: ''
        },
        size: {
          md: 'px-2.5 py-1.5 gap-2',
          sm: 'px-2 py-1 gap-1.5',
          xs: 'px-1.5 py-1 gap-1',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'md',
        disabled: false
      }
    }
  ),
  listItem: cva(
    'group flex items-center justify-between shrink-0 transition-colors duration-100 cursor-pointer select-none rounded-md',
    {
      variants: {
        selected: {
          true: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
          false: 'text-ui-fg hover:bg-ui-hover'
        },
        disabled: {
          true: 'text-ui-fg-subtle cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent',
          false: ''
        },
        size: {
          md: 'px-2.5 py-2 gap-2 text-sm',
          sm: 'px-2 py-1.5 gap-1.5 text-sm',
          xs: 'px-1.5 py-1 gap-1 text-xs',
          custom: ''
        }
      },
      compoundVariants: [
        {
          disabled: true,
          selected: true,
          className: 'text-ui-fg-subtle bg-transparent dark:bg-transparent'
        }
      ],
      defaultVariants: {
        size: 'md',
        selected: false,
        disabled: false
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
