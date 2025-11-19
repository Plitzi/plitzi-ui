import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'success', 'error', 'warning', 'info', 'other'],
  size: ['xs', 'sm', 'md', 'lg', 'xl'],
  solid: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Badge';

export default {
  root: cva('flex relative rounded-sm', {
    variants: {
      intent: {
        default: '',
        success: '',
        error: '',
        warning: '',
        info: '',
        other: ''
      },
      size: {
        xs: 'p-1.5 text-xs gap-1.5',
        sm: 'p-2 text-sm gap-2',
        md: 'p-2.5 gap-2.5',
        lg: 'p-3 gap-3',
        xl: 'p-4 gap-4'
      },
      solid: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      { solid: true, intent: 'default', className: 'bg-gray-400' },
      { solid: false, intent: 'default', className: 'bg-gray-500/10 border-gray-500 border text-gray-600' },
      { solid: true, intent: 'info', className: 'bg-blue-400' },
      { solid: false, intent: 'info', className: 'bg-blue-500/10 border-blue-500 border text-blue-600' },
      { solid: true, intent: 'success', className: 'bg-green-400' },
      { solid: false, intent: 'success', className: 'bg-green-500/10 border-green-500 border text-green-600' },
      { solid: true, intent: 'warning', className: 'bg-orange-400' },
      { solid: false, intent: 'warning', className: 'bg-orange-500/10 border-orange-500 border text-orange-600' },
      { solid: true, intent: 'error', className: 'bg-red-400' },
      { solid: false, intent: 'error', className: 'bg-red-500/10 border-red-500 border text-red-600' },
      { solid: true, intent: 'other', className: 'bg-gray-400' },
      { solid: false, intent: 'other', className: 'bg-gray-500/10 border-gray-500 border text-gray-600' }
    ],
    defaultVariants: {
      intent: 'success',
      size: 'md',
      solid: true
    }
  }),
  iconContainer: cva('flex items-center', {
    variants: {
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  icon: cva('', {
    variants: {
      intent: {
        default: '',
        success: '',
        error: '',
        warning: '',
        info: ''
      },
      size: {
        xs: '',
        sm: '',
        md: '',
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
  content: cva('grow basis-0 min-w-0')
};
