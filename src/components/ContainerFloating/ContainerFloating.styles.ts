import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['dropdown', 'custom'],
  disabled: [true, false],
  visible: [true, false],
  placement: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerFloating';

export default {
  root: cva('flex', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  backgroundContainer: cva('top-0 bottom-0 left-0 right-0 z-50 fixed', {
    variants: {
      intent: {
        dropdown: 'bg-black opacity-40',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'dropdown'
    }
  }),
  trigger: cva('cursor-pointer'),
  content: cva('flex items-center w-full h-full', {
    variants: {
      intent: {
        dropdown: 'bg-black text-white',
        custom: ''
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'dropdown',
      disabled: false
    }
  }),
  container: cva('fixed z-[801]', {
    variants: {
      // visible: {
      //   true: 'flex',
      //   false: 'invisible'
      // }
      placement: {
        'top-left': '-translate-y-full',
        'top-right': '-translate-y-full',
        'bottom-left': '',
        'bottom-right': ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      // visible: false
      placement: 'bottom-left'
    }
  })
};
