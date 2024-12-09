// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: [],
  size: [],
  collapsed: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerDraggable';

export default {
  root: cva('absolute z-50 flex flex-col overflow-hidden rounded-lg p-2', {
    variants: {
      intent: {},
      size: {},
      collapsed: {
        false: 'rounded',
        true: 'not-last:mr-4 !top-auto !left-auto relative rounded-tl rounded-tr'
      }
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  header: cva('h-9 pb-2 px-1 flex justify-between items-center select-none bg-white', {
    variants: {
      intent: {},
      collapsed: {
        true: '',
        false: 'border-b border-gray-300'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      collapsed: false
    }
  }),
  headerLabel: cva('flex items-center gap-1 truncate grow cursor-move font-bold text-lg', {
    variants: {
      intent: {},
      collapsed: {
        true: '!cursor-auto',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  content: cva('grow', {
    variants: {
      intent: {},
      collapsed: {
        true: 'hidden',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      collapsed: false
    }
  }),
  btn: cva('h-6 w-6', {
    variants: {
      intent: {},
      collapsed: {}
    },
    compoundVariants: [],
    defaultVariants: {}
  })
};
