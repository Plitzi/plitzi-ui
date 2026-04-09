import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  error: [true, false],
  disabled: [true, false],
  inline: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Input';

export default {
  root: cva('flex flex-col', {
    variants: {
      intent: {
        primary: '',
        custom: ''
      },
      disabled: {
        true: 'opacity-60 pointer-events-none',
        false: ''
      },
      size: {
        md: 'gap-1.5',
        sm: 'gap-1 text-sm',
        xs: 'gap-1 text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  inputContainer: cva(
    'flex items-center border relative transition-colors duration-150 focus-within:ring-2 focus-within:ring-offset-0',
    {
      variants: {
        intent: {
          primary: 'bg-white dark:bg-zinc-800 dark:text-zinc-300',
          custom: ''
        },
        error: {
          true: 'border-red-500 focus-within:ring-red-500/30',
          false:
            'border-gray-300 dark:border-zinc-700 focus-within:ring-primary-500/30 dark:focus-within:ring-primary-400/30 hover:border-gray-400 dark:hover:border-zinc-500'
        },
        disabled: {
          true: 'cursor-not-allowed opacity-60 pointer-events-none',
          false: ''
        },
        size: {
          md: 'py-2 px-3 gap-2 rounded-lg',
          sm: 'py-1.5 px-2.5 gap-1.5 rounded',
          xs: 'py-1 px-2 gap-1 rounded-sm',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'primary',
        error: false,
        disabled: false,
        size: 'md'
      }
    }
  ),
  input: cva('p-0 border-0 outline-none focus:ring-0 w-full bg-transparent', {
    variants: {
      intent: {
        primary: 'text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-500'
      },
      error: {
        true: '',
        false: ''
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: ''
      },
      size: {
        md: 'text-sm',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      disabled: false,
      error: false
    }
  }),
  label: cva('text-sm font-medium text-zinc-700 dark:text-zinc-300', {
    variants: {
      inline: {
        true: 'flex select-none items-center',
        false: ''
      },
      disabled: {
        true: '',
        false: ''
      },
      size: {
        md: '',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [
      { inline: true, disabled: true, className: 'cursor-not-allowed' },
      { inline: true, disabled: false, className: 'cursor-pointer' },
      { inline: true, size: 'md', className: 'gap-2' },
      { inline: true, size: 'sm', className: 'gap-1.5' },
      { inline: true, size: 'xs', className: 'gap-1' }
    ],
    defaultVariants: {
      inline: false,
      disabled: false,
      size: 'md'
    }
  }),
  iconFloatingContainer: cva('flex items-center justify-center', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        md: 'gap-2',
        sm: 'gap-1.5',
        xs: 'gap-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  icon: cva('border-r border-gray-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 shrink-0', {
    variants: {
      intent: {
        primary: ''
      },
      error: {
        true: 'text-red-500 dark:text-red-400',
        false: ''
      },
      size: {
        md: 'pr-2.5 mr-0.5',
        sm: 'pr-2 mr-0.5',
        xs: 'pr-1.5 mr-0.5',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  iconError: cva('', {
    variants: {
      intent: {
        primary: ''
      },
      error: {
        true: 'text-red-500 dark:text-red-400',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary'
    }
  }),
  iconClear: cva(
    'cursor-pointer text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-150'
  ),
  iconLoading: cva('text-zinc-400 dark:text-zinc-500')
};
