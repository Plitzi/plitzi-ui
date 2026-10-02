import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  selected: [true, false],
  dragging: [true, false],
  dropTarget: [true, false],
  active: [true, false],
  highlighted: [true, false],
  dimmed: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'TreeCanvas';

export default {
  root: cva(
    'relative overflow-hidden outline-none select-none touch-none cursor-grab active:cursor-grabbing bg-white dark:bg-zinc-900 [--tree-canvas-dot:var(--color-gray-300)] dark:[--tree-canvas-dot:var(--color-zinc-700)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40'
  ),
  layer: cva('absolute top-0 left-0 origin-top-left'),
  edges: cva('absolute top-0 left-0 overflow-visible pointer-events-none'),
  edge: cva('fill-none transition-[stroke,opacity] duration-200', {
    variants: {
      highlighted: {
        true: 'stroke-primary-500 dark:stroke-primary-400 [stroke-width:2]',
        false: 'stroke-gray-300 dark:stroke-zinc-600 [stroke-width:1.5]'
      },
      dimmed: { true: 'opacity-30', false: '' }
    },
    defaultVariants: { highlighted: false, dimmed: false }
  }),
  // Positions ease into place when the tree folds or an item moves; never while it follows the pointer.
  node: cva(
    'absolute rounded-xl cursor-pointer outline-none transition-[left,top,box-shadow,opacity] duration-200 ease-out',
    {
      variants: {
        dimmed: { true: 'opacity-35', false: '' },
        selected: {
          true: 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-primary-400 dark:ring-offset-zinc-900',
          false: ''
        },
        dragging: {
          true: 'z-10 opacity-80 shadow-xl cursor-grabbing transition-none',
          false: ''
        },
        dropTarget: {
          true: 'ring-2 ring-dashed ring-primary-500 ring-offset-4 ring-offset-white dark:ring-primary-400 dark:ring-offset-zinc-900',
          false: ''
        }
      },
      defaultVariants: { selected: false, dragging: false, dropTarget: false, dimmed: false }
    }
  ),
  toggle: cva(
    'absolute -bottom-3 left-1/2 z-10 flex h-6 min-w-6 -translate-x-1/2 items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-1.5 text-[10px] font-semibold text-gray-500 shadow-sm cursor-pointer hover:border-primary-300 hover:text-primary-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-primary-400/50 dark:hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40'
  ),
  rootDrop: cva(
    'absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 text-xs font-medium pointer-events-none transition-colors',
    {
      variants: {
        active: {
          true: 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-400/15 dark:text-primary-200',
          false: 'border-gray-300 bg-white/90 text-gray-500 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-zinc-400'
        }
      },
      defaultVariants: { active: false }
    }
  ),
  controls: cva(
    'absolute bottom-3 right-3 z-20 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900'
  ),
  controlButton: cva(
    'flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40'
  ),
  zoomLabel: cva('min-w-11 text-center text-[11px] font-medium tabular-nums text-gray-500 dark:text-zinc-400')
};
