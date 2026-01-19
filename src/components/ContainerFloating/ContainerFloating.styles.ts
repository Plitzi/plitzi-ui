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
        dropdown: 'bg-white shadow-[0_7px_14px_0_rgba(65,69,88,0.1),0_3px_6px_0_rgba(0,0,0,0.07)] rounded-lg',
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
