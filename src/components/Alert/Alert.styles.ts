// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'success', 'error', 'warning', 'info'],
  size: ['md', 'lg', 'xl']
} as const;

export const STYLES_COMPONENT_NAME = 'Alert';

export default {
  root: cva('w-full flex relative rounded-sm', {
    variants: {
      intent: {
        default: '',
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-orange-400',
        info: 'bg-blue-400'
      },
      size: {
        md: 'p-4',
        lg: '',
        xl: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
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
        md: '',
        lg: 'fa-2x',
        xl: 'fa-3x'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  }),
  content: cva('grow basis-0 min-w-0')
};
