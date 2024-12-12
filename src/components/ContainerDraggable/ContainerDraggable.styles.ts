// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: [],
  size: [],
  collapsed: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerDraggable';

export default {
  root: cva('flex flex-col overflow-hidden p-2', {
    variants: {
      intent: {},
      size: {},
      collapsed: {
        false: 'rounded-lg absolute z-50',
        true: 'not-last:mr-4 !top-auto !left-auto relative rounded-tl-lg rounded-tr-lg'
      }
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  header: cva('h-9 px-1 gap-4 flex justify-between items-center select-none bg-white', {
    variants: {
      intent: {},
      collapsed: {
        true: '',
        false: 'pb-2 border-b border-gray-300'
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
