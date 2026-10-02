import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'success', 'error', 'warning', 'info', 'other'],
  size: ['xs', 'sm', 'md', 'lg', 'xl'],
  solid: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Alert';

export default {
  root: cva('w-full flex relative rounded-md', {
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
      { solid: true, intent: 'default', className: 'bg-gray-400 dark:bg-zinc-600' },
      {
        solid: false,
        intent: 'default',
        className:
          'bg-gray-500/10 border-gray-500 border text-gray-600 dark:bg-zinc-500/20 dark:border-zinc-500 dark:text-zinc-300'
      },
      { solid: true, intent: 'info', className: 'bg-primary-500 text-white dark:bg-primary-400' },
      {
        solid: false,
        intent: 'info',
        className:
          'bg-primary-500/8 border-primary-500/35 border text-primary-700 dark:bg-primary-400/12 dark:border-primary-400/40 dark:text-primary-300'
      },
      { solid: true, intent: 'success', className: 'bg-green-400 dark:bg-green-600' },
      {
        solid: false,
        intent: 'success',
        className:
          'bg-green-500/8 border-green-600/35 border text-green-700 dark:bg-green-400/12 dark:border-green-400/40 dark:text-green-300'
      },
      { solid: true, intent: 'warning', className: 'bg-amber-500 dark:bg-amber-600' },
      {
        solid: false,
        intent: 'warning',
        className:
          'bg-amber-500/10 border-amber-600/35 border text-amber-800 dark:bg-amber-400/12 dark:border-amber-400/40 dark:text-amber-300'
      },
      { solid: true, intent: 'error', className: 'bg-red-400 dark:bg-red-600' },
      {
        solid: false,
        intent: 'error',
        className:
          'bg-red-500/8 border-red-600/35 border text-red-700 dark:bg-red-400/12 dark:border-red-400/40 dark:text-red-300'
      },
      { solid: true, intent: 'other', className: 'bg-gray-400 dark:bg-zinc-600' },
      {
        solid: false,
        intent: 'other',
        className:
          'bg-gray-500/10 border-gray-500 border text-gray-600 dark:bg-zinc-500/20 dark:border-zinc-500 dark:text-zinc-300'
      }
    ],
    // Soft by default: a status is read alongside the work, and a slab of saturated colour shouts over it. `solid` is
    // for the rare message that must stop the eye.
    defaultVariants: {
      intent: 'success',
      size: 'md',
      solid: false
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
  closeIconContainer: cva('flex items-start cursor-pointer', {
    variants: {
      size: {
        xs: 'p-0.5',
        sm: 'p-0.5',
        md: 'p-0.5',
        lg: 'p-0.5',
        xl: 'p-0.5'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  content: cva('grow basis-0 min-w-0')
};
