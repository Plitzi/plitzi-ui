// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['md', 'sm', 'xs']
} as const;

export const STYLES_COMPONENT_NAME = 'Select';

export default {
  input: cva('p-0 border-0 outline-none focus:ring-0 w-full', {
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
        className: 'pr-6'
      },
      {
        intent: 'error',
        size: 'sm',
        className: 'pr-5'
      },
      {
        intent: 'error',
        size: 'xs',
        className: 'pr-4'
      }
    ],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  })
};
