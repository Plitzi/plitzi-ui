// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = {
  intent: ['default', 'success', 'error', 'warning', 'info'],
  size: ['base', 'lg', 'xl']
} as const;

export const STYLES_COMPONENT_NAME = 'Alert';

export default {
  root: cva('w-full flex relative rounded', {
    variants: {
      intent: {
        default: '',
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-orange-400',
        info: 'bg-blue-400'
      },
      size: {
        base: 'p-4',
        lg: '',
        xl: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  iconContainer: cva('flex items-center mr-4'),
  icon: cva('', {
    variants: {
      intent: {
        default: '',
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-orange-400',
        info: 'bg-blue-400'
      },
      size: {
        base: '',
        lg: 'fa-2x',
        xl: 'fa-3x'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  }),
  content: cva('grow basis-0 min-w-0')
};
