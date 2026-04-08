import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: [],
  size: [],
  collapsed: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerDraggable';

export default {
  root: cva(
    'flex flex-col overflow-hidden absolute z-50 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-xl shadow-black/10 dark:shadow-black/40',
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
  header: cva('px-3 gap-3 flex justify-between items-center select-none', {
    variants: {
      intent: {},
      collapsed: {
        true: 'h-10',
        false: 'h-10 border-b border-gray-200 dark:border-zinc-700'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      collapsed: false
    }
  }),
  headerLabel: cva(
    'flex items-center gap-1.5 truncate grow cursor-move text-sm font-semibold text-zinc-800 dark:text-zinc-200',
    {
      variants: {
        intent: {},
        collapsed: {
          true: '',
          false: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {}
    }
  ),
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
    'h-6 w-6 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-100 cursor-pointer',
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
