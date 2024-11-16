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
        default: '',
        error: '',
        disabled: ''
      },
      size: {
        base: 'py-2.5 px-4 text-base',
        sm: 'py-1.5 px-3 text-sm',
        xs: 'py-1.5 px-2 text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  icon: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        base: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
