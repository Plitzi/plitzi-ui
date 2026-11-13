import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: [],
  size: [],
  collapsed: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerDraggable';

export default {
  root: cva(
    'flex flex-col absolute z-50 rounded-lg bg-ui-panel border border-ui-line-strong shadow-xl shadow-black/10 dark:shadow-black/40',
    {
      variants: {
        intent: {},
        size: {},
        collapsed: {
          false: '',
          true: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {}
    }
  ),
  cardBody: cva('px-2 pb-2'),
  header: cva('px-2 gap-3 flex justify-between items-center select-none', {
    variants: {
      intent: {},
      collapsed: {
        true: 'h-10',
        false: 'h-10 border-b border-ui-line'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      collapsed: false
    }
  }),
  headerLabel: cva('flex items-center gap-1.5 truncate grow cursor-move text-sm font-semibold text-ui-fg', {
    variants: {
      intent: {},
      collapsed: {
        true: '',
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
  btn: cva(
    'h-6 w-6 flex items-center justify-center rounded-sm text-ui-fg-subtle hover:text-ui-fg hover:bg-ui-hover transition-colors duration-100 cursor-pointer',
    {
      variants: {
        intent: {},
        collapsed: {}
      },
      compoundVariants: [],
      defaultVariants: {}
    }
  ),
  btnClose: cva(
    'h-6 w-6 flex items-center justify-center rounded-sm text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-100 cursor-pointer',
    {
      variants: {
        intent: {},
        collapsed: {}
      },
      compoundVariants: [],
      defaultVariants: {}
    }
  )
};
