// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['xs', 'sm', 'base']
} as const;

export const STYLES_COMPONENT_NAME = 'MetricInput';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: 'border-gray-200',
        error: '',
        disabled: 'text-gray-400'
      },
      size: {
        base: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  inputContainer: cva('flex items-center border rounded-lg relative', {
    variants: {
      intent: {
        default: 'border-gray-200',
        error: 'border-red-600',
        disabled: 'cursor-not-allowed'
      },
      size: {
        base: 'py-2.5 px-4 gap-2',
        sm: 'py-1.5 px-2 gap-1.5',
        xs: 'py-1 px-1 gap-1'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  input: cva('p-0 border-0 outline-none focus:ring-0', {
    variants: {
      intent: {
        default: '',
        error: '',
        disabled: 'cursor-not-allowed'
      },
      size: {
        base: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [
      {
        intent: 'error',
        size: 'base',
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
      size: 'base'
    }
  }),
  units: cva(
    [
      'border-l-1 border-gray-400 py-0 pr-0 border-y-0 border-r-0 bg-none text-center select-none cursor-pointer',
      'focus:outline-0 focus:ring-0 focus:border-gray-400 focus:shadow-none'
    ],
    {
      variants: {
        intent: {
          default: '',
          error: '',
          disabled: 'cursor-not-allowed'
        },
        size: {
          base: 'pl-2 text-base min-w-10',
          sm: 'pl-1.5 text-sm min-w-8',
          xs: 'pl-1 text-xs min-w-7'
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'default',
        size: 'base'
      }
    }
  ),
  iconFloatingContainer: cva('flex absolute top-1/2 -translate-y-1/2', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        base: 'right-16 gap-2',
        sm: 'right-12 gap-1.5',
        xs: 'right-10 gap-1'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  icon: cva('', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-600'
      },
      size: {
        base: '',
        sm: '',
        xs: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  iconError: cva('', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-600'
      },
      size: {
        base: '',
        sm: '',
        xs: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  iconLoading: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        base: '',
        sm: '',
        xs: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
