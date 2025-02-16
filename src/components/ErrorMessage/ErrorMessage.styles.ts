import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  error: [true, false],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ErrorMessage';

export default {
  root: cva('first-letter:capitalize', {
    variants: {
      intent: {
        primary: '',
        custom: ''
      },
      default: {
        true: '',
        false: ''
      },
      error: {
        true: 'text-red-600',
        false: ''
      },
      size: {
        md: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      error: false,
      default: false
    }
  })
};
