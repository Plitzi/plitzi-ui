import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['xs', 'sm', 'md', 'custom'],
  disabled: [true, false],
  error: [true, false],
  rounded: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'CodeMirror';

export default {
  input: cva('h-full w-full grow basis-0 overflow-auto', {
    variants: {
      intent: {
        primary: '',
        custom: ''
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: ''
      },
      error: {
        true: '',
        false: ''
      },
      size: {
        md: '',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      },
      rounded: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        rounded: true,
        size: 'md',
        className: 'rounded-lg'
      },
      {
        rounded: true,
        size: 'sm',
        className: 'rounded'
      },
      {
        rounded: true,
        size: 'xs',
        className: 'rounded-sm'
      }
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      disabled: false,
      error: false
    }
  }),
  iconFloatingContainer: cva('', {
    variants: {
      error: {
        true: '!items-start',
        false: ''
      },
      size: {
        md: 'py-1.5',
        sm: 'py-1',
        xs: 'py-0.5'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md',
      error: false
    }
  }),
  inputContainer: cva('border-none p-0 h-full w-full', {
    variants: {
      error: {
        true: '!items-start',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      error: false
    }
  })
};
