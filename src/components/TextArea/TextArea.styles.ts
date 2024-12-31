// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['xs', 'sm', 'md']
} as const;

export const STYLES_COMPONENT_NAME = 'TextArea';

export default {
  input: cva('p-0 border-0 outline-none focus:ring-0', {
    variants: {
      intent: {
        default: '',
        error: '',
        disabled: 'cursor-not-allowed'
      },
      size: {
        md: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [
      {
        intent: 'error',
        size: 'md',
        className: 'pr-3'
      },
      {
        intent: 'error',
        size: 'sm',
        className: 'pr-3'
      },
      {
        intent: 'error',
        size: 'xs',
        className: 'pr-2.5'
      }
    ],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  })
};
