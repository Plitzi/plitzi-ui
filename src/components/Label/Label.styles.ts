// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'error', 'disabled', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  disabled: [true, false],
  error: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Label';

export default {
  root: cva('', {
    variants: {
      intent: {
        primary: 'border-gray-200',
        disabled: 'text-gray-400',
        custom: ''
      },
      error: {
        true: 'text-red-600',
        false: ''
      },
      disabled: {
        true: 'cursor-not-allowed text-gray-400',
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
      error: false,
      disabled: false
    }
  })
};
