import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['dropdown', 'custom'],
  disabled: [true, false],
  placement: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerFloating';

export default {
  root: cva('', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  trigger: cva('cursor-pointer'),
  content: cva('flex w-full h-full', {
    variants: {
      intent: {
        dropdown:
          'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg shadow-black/10 dark:shadow-black/30 rounded-lg',
        custom: ''
      },
      disabled: {
        true: 'cursor-not-allowed pointer-events-none opacity-60',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'dropdown',
      disabled: false
    }
  }),
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
  })
};
