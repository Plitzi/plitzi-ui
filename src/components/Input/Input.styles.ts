// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  error: [true, false],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Input';

export default {
  root: cva('flex flex-col', {
    variants: {
      intent: {
        primary: 'border-gray-200',
        error: '',
        disabled: 'text-gray-400'
      },
      size: {
        md: 'gap-2 text-base',
        sm: 'gap-1.5 text-sm',
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
  inputContainer: cva('flex items-center border rounded-lg relative', {
    variants: {
      intent: {
        primary: 'bg-white',
        custom: ''
      },
      error: {
        true: 'border-red-600',
        false: 'border-gray-200'
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: ''
      },
      size: {
        md: 'py-2.5 px-4 gap-2',
        sm: 'py-1.5 px-2 gap-1.5',
        xs: 'py-1 px-1 gap-1',
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
  }),
  input: cva('p-0 border-0 outline-none focus:ring-0 w-full', {
    variants: {
      intent: {
        primary: ''
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
        md: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [
      {
        error: true,
        size: 'md',
        className: 'pr-6'
      },
      {
        error: true,
        size: 'sm',
        className: 'pr-5'
      },
      {
        error: true,
        size: 'xs',
        className: 'pr-4'
      }
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      disabled: false,
      error: false
    }
  }),
  iconFloatingContainer: cva('flex absolute top-1/2 -translate-y-1/2', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        md: 'right-4 gap-2',
        sm: 'right-3 gap-1.5',
        xs: 'right-2 gap-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  icon: cva('border-r border-gray-400 shrink-0', {
    variants: {
      intent: {
        primary: ''
      },
      error: {
        true: 'text-red-600',
        false: ''
      },
      size: {
        md: 'pr-2',
        sm: 'pr-1.5',
        xs: 'pr-1',
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
        true: 'text-red-600',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary'
    }
  }),
  iconClear: cva('cursor-pointer'),
  iconLoading: cva('')
};
