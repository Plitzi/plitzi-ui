import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error'],
  size: ['xs', 'sm', 'md'],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'MetricInput';

export default {
  root: cva('flex flex-col', {
    variants: {
      intent: {
        default: '',
        error: ''
      },
      disabled: {
        true: 'opacity-60 pointer-events-none',
        false: ''
      },
      size: {
        md: 'gap-1.5',
        sm: 'gap-1 text-sm',
        xs: 'gap-1 text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md',
      disabled: false
    }
  }),
  inputContainer: cva(
    'flex items-center border relative transition-colors duration-150 focus-within:ring-2 focus-within:ring-offset-0 bg-white dark:bg-zinc-800 dark:text-zinc-300',
    {
      variants: {
        intent: {
          default:
            'border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:ring-primary-500/30 dark:focus-within:ring-primary-400/30',
          error: 'border-red-500 focus-within:ring-red-500/30'
        },
        size: {
          md: 'py-2 px-3 gap-2 rounded-lg',
          sm: 'py-1.5 px-2.5 gap-1.5 rounded',
          xs: 'py-1 px-2 gap-1 rounded-sm'
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'default',
        size: 'md'
      }
    }
  ),
  input: cva(
    'p-0 outline-none focus:ring-0 basis-0 grow min-w-0 border-none bg-transparent text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-500',
    {
      variants: {
        intent: {
          default: '',
          error: ''
        },
        disabled: {
          true: 'cursor-not-allowed',
          false: ''
        },
        size: {
          md: 'text-sm',
          sm: 'text-sm',
          xs: 'text-xs'
        }
      },
      compoundVariants: [
        { intent: 'error', size: 'md', className: 'pr-6' },
        { intent: 'error', size: 'sm', className: 'pr-5' },
        { intent: 'error', size: 'xs', className: 'pr-4' }
      ],
      defaultVariants: {
        intent: 'default',
        size: 'md',
        disabled: false
      }
    }
  ),
  units: cva(
    'select-none text-center font-medium text-zinc-500 dark:text-zinc-400 border-l border-gray-200 dark:border-zinc-600 transition-colors duration-100',
    {
      variants: {
        intent: {
          default: '',
          error: ''
        },
        disabled: {
          true: 'cursor-not-allowed',
          false: 'cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200'
        },
        size: {
          md: 'text-sm min-w-10 pl-2',
          sm: 'text-sm min-w-9 pl-1.5',
          xs: 'text-xs min-w-8 pl-1'
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'default',
        size: 'md',
        disabled: false
      }
    }
  ),
  iconFloatingContainer: cva('flex absolute top-1/2 -translate-y-1/2', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        md: 'right-14 gap-2',
        sm: 'right-12 gap-1.5',
        xs: 'right-10 gap-1'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  }),
  icon: cva('shrink-0 text-zinc-400 dark:text-zinc-500', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-500 dark:text-red-400'
      },
      size: {}
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default'
    }
  }),
  iconError: cva('shrink-0', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-500 dark:text-red-400'
      },
      size: {
        md: '',
        sm: '',
        xs: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  }),
  iconLoading: cva('text-zinc-400 dark:text-zinc-500', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        md: '',
        sm: '',
        xs: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  }),
  divider: cva('w-px bg-gray-200 dark:bg-zinc-700 self-stretch shrink-0')
};
