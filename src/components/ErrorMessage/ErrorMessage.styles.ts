// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'ErrorMessage';

export default {
  root: cva('first-letter:capitalize', {
    variants: {
      intent: {
        default: 'text-red-600',
        error: 'text-red-600',
        disabled: ''
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
      intent: 'default',
      size: 'md'
    }
  })
};
