// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['xs', 'sm', 'base']
} as const;

export const STYLES_COMPONENT_NAME = 'TextArea';

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
  inputContainer: cva('flex flex-col items-center border rounded-lg relative', {
    variants: {
      intent: {
        default: 'border-gray-200',
        error: 'border-red-600',
        disabled: 'cursor-not-allowed'
      },
      size: {
        base: 'py-3.5 px-3 gap-2',
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
        className: 'pr-3'
      },
      {
        intent: 'error',
        size: 'sm',
        className: 'pr-2.5'
      },
      {
        intent: 'error',
        size: 'xs',
        className: 'pr-2'
      }
    ],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  iconFloatingContainer: cva('flex flex-col absolute', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        base: 'right-2.5 top-2.5 gap-2',
        sm: 'right-2 top-2 gap-1.5',
        xs: 'right-1.5 top-1.5 gap-1'
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
