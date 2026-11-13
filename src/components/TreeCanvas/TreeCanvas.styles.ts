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
    'relative overflow-hidden outline-none select-none touch-none cursor-grab active:cursor-grabbing bg-ui-panel [--tree-canvas-dot:var(--color-gray-300)] dark:[--tree-canvas-dot:var(--color-zinc-700)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40'
  ),
  layer: cva('absolute top-0 left-0 origin-top-left'),
  edges: cva('absolute top-0 left-0 overflow-visible pointer-events-none'),
  edge: cva('fill-none transition-[stroke,opacity] duration-200', {
    variants: {
      highlighted: {
        true: 'stroke-primary-500 dark:stroke-primary-400 [stroke-width:2]',
        false: 'stroke-ui-fg-subtle dark:stroke-ui-fg-subtle [stroke-width:1.5]'
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
    'absolute -bottom-3 left-1/2 z-10 flex h-6 min-w-6 -translate-x-1/2 items-center justify-center gap-1 rounded-full border border-ui-line bg-ui-panel px-1.5 text-[10px] font-semibold text-ui-fg-subtle shadow-sm cursor-pointer hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-400/50 dark:hover:text-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40'
  ),
  rootDrop: cva(
    'absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 text-xs font-medium pointer-events-none transition-colors',
    {
      variants: {
        active: {
          true: 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-400/15 dark:text-primary-200',
          false: 'border-ui-line-strong bg-white/90 text-ui-fg-subtle dark:bg-ui-panel/90'
        }
      },
      defaultVariants: { active: false }
    }
  ),
  controls: cva(
    'absolute bottom-3 right-3 z-20 flex items-center gap-0.5 rounded-lg border border-ui-line bg-ui-panel p-0.5 shadow-sm'
  ),
  controlButton: cva(
    'flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs text-ui-fg-subtle cursor-pointer hover:bg-ui-hover hover:text-ui-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40'
  ),
  zoomLabel: cva('min-w-11 text-center text-[11px] font-medium tabular-nums text-ui-fg-subtle')
};
