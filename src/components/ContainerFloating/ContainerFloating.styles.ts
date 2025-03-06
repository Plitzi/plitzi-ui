import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['dropdown', 'custom'],
  disabled: [true, false],
  visible: [true, false],
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
