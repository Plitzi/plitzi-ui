import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['xs', 'sm', 'md', 'custom'],
  disabled: [true, false],
  error: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'TextArea';

export default {
  input: cva('p-0 border-0 outline-none focus:ring-0 w-full', {
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
  iconFloatingContainer: cva('', {
    variants: {
      error: {
        true: '!items-start',
        false: ''
      },
      size: {
        md: 'py-1.5',
        sm: 'py-1',
        xs: 'py-0.5',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md',
      error: false
    }
  }),
  inputContainer: cva('', {
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
