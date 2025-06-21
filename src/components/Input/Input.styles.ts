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
        primary: '',
        custom: ''
      },
      disabled: {
        true: 'text-gray-400',
        false: ''
      },
      size: {
        md: 'gap-2',
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
  inputContainer: cva('flex items-center border relative', {
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
        md: 'py-2.5 px-4 gap-2 rounded-lg',
        sm: 'py-1.5 px-2 gap-1.5 rounded',
        xs: 'py-1 px-1 gap-1 rounded-sm',
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
        primary: 'bg-white'
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
        md: '',
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
  iconFloatingContainer: cva('flex', {
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
        true: 'text-red-500',
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
