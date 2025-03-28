import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error'],
  size: ['xs', 'sm', 'md'],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'MetricInput';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: 'border-gray-200',
        error: ''
      },
      disabled: {
        true: 'text-gray-400 cursor-not-allowed',
        false: ''
      },
      size: {
        md: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md',
      disabled: false
    }
  }),
  inputContainer: cva('flex items-center border relative', {
    variants: {
      intent: {
        default: 'border-gray-200',
        error: 'border-red-600'
      },
      size: {
        md: 'py-2 px-2.5 gap-2 rounded-lg',
        sm: 'py-1.5 px-2 gap-1.5 rounded',
        xs: 'py-1 px-1.5 gap-1 rounded-sm'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  }),
  input: cva('p-0 outline-none focus:ring-0 basis-0 grow min-w-0', {
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
        md: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [
      {
        intent: 'error',
        size: 'md',
        className: 'pr-6'
      },
      {
        intent: 'error',
        size: 'sm',
        className: 'pr-5'
      },
      {
        intent: 'error',
        size: 'xs',
        className: 'pr-4'
      }
    ],
    defaultVariants: {
      intent: 'default',
      size: 'md',
      disabled: false
    }
  }),
  units: cva('select-none text-center', {
    variants: {
      intent: {
        default: '',
        error: ''
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer'
      },
      size: {
        md: 'text-base min-w-9',
        sm: 'text-sm min-w-8',
        xs: 'text-xs min-w-7'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md',
      disabled: false
    }
  }),
  iconFloatingContainer: cva('flex absolute top-1/2 -translate-y-1/2', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        md: 'right-16 gap-2',
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
  icon: cva('shrink-0', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-600'
      },
      size: {
        // md: 'pr-2',
        // sm: 'pr-1.5',
        // xs: 'pr-1'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default'
      // size: 'md'
    }
  }),
  iconError: cva('', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-600'
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
  iconLoading: cva('', {
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
  divider: cva('w-px bg-gray-300 self-stretch shrink-0')
};
