import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  disabled: [true, false],
  active: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'MenuList';

export default {
  root: cva('', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  trigger: cva('cursor-pointer'),
  container: cva('fixed z-801', {
    variants: {
      placement: {
        'top-left': '-translate-y-full',
        'top-right': '-translate-y-full',
        'bottom-left': '',
        'bottom-right': ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      placement: 'bottom-left'
    }
  }),
  menu: cva(
    'flex gap-0.5 flex-col py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg shadow-black/10 dark:shadow-black/30 min-w-43.75 rounded-lg overflow-hidden'
  ),
  menuItem: cva('flex items-center py-1.5 px-3 gap-2 text-sm mx-1.5 rounded-md transition-colors duration-100', {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-zinc-400 dark:text-zinc-500',
        false:
          'cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700/60 hover:text-zinc-900 dark:hover:text-zinc-100'
      },
      active: {
        true: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      disabled: false
    }
  }),
  icon: cva('shrink-0 w-4 text-zinc-500 dark:text-zinc-400')
};
