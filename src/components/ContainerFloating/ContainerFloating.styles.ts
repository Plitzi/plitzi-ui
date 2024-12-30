// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['dark', 'custom'],
  disabled: [true, false],
  visible: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerFloating';

export default {
  root: cva('', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  backgroundContainer: cva('top-0 bottom-0 left-0 right-0 z-50 fixed', {
    variants: {
      intent: {
        dark: 'bg-black opacity-40',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'dark'
    }
  }),
  content: cva('flex items-center w-full h-full', {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      disabled: false
    }
  }),
  container: cva('fixed z-[60]', {
    variants: {
      visible: {
        true: 'flex',
        false: 'invisible'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      visible: false
    }
  })
};
