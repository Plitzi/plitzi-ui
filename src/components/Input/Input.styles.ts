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
          primary: 'bg-ui-raised text-ui-fg',
          custom: ''
        },
        error: {
          true: 'border-red-500 focus-within:ring-red-500/30',
          false:
            'border-ui-line-strong focus-within:ring-primary-500/30 dark:focus-within:ring-primary-400/30 hover:border-ui-line-strong'
        },
        disabled: {
          true: 'cursor-not-allowed opacity-60 pointer-events-none',
          false: ''
        },
        size: {
          md: 'py-2 px-3 gap-2 rounded-lg',
          sm: 'py-1.5 px-2.5 gap-1.5 rounded-md',
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
        primary: 'text-ui-fg placeholder:text-ui-fg-subtle'
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
  label: cva('text-sm font-medium text-ui-fg', {
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
  icon: cva('border-r border-ui-line-strong text-ui-fg-subtle shrink-0', {
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
  iconClear: cva('cursor-pointer text-ui-fg-subtle hover:text-ui-fg transition-colors duration-150'),
  iconLoading: cva('text-ui-fg-subtle')
};
