// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['xs', 'sm', 'base']
} as const;

export const STYLES_COMPONENT_NAME = 'Input';

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
        base: 'py-2.5 px-4 px-3 gap-2',
        sm: 'py-1.5 px-3 gap-1.5',
        xs: 'py-1.5 px-2 gap-1'
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
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  units: cva(
    'border-l-1 border-gray-400 py-0 pr-0 pl-2 border-y-0 border-r-0 focus:outline-0 focus:ring-0 focus:border-gray-400 focus:shadow-none bg-none',
    {
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
      compoundVariants: [],
      defaultVariants: {
        intent: 'default',
        size: 'base'
      }
    }
  ),
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
  iconError: cva('absolute top-1/2 -translate-y-1/2', {
    variants: {
      intent: {
        default: '',
        error: 'text-red-600'
      },
      size: {
        base: 'right-16',
        sm: 'right-14',
        xs: 'right-12'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
