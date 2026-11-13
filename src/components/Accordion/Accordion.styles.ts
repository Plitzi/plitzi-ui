import { cva } from 'class-variance-authority';

export const variantKeys = {
  intent: ['default'],
  grow: [true, false],
  size: ['xs', 'md', 'sm', 'lg', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Accordion';

export default {
  root: cva('overflow-auto', {
    variants: {
      intent: {
        default: []
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default'
    }
  }),
  item: cva('border-b border-ui-line last:border-b-0'),
  itemHeader: cva(
    'flex items-center justify-between font-semibold cursor-pointer select-none transition-colors duration-150 hover:bg-ui-hover text-ui-fg',
    {
      variants: {
        size: {
          xs: 'px-2 py-1 text-xs h-7',
          sm: 'px-2.5 py-1.5 text-sm h-8',
          md: 'px-3 py-2 text-sm h-10',
          lg: 'px-3 py-2.5 text-base h-12',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'lg'
      }
    }
  ),
  itemHeaderSlot: cva('min-w-0 truncate'),
  itemHeaderIcon: cva(
    'flex items-center justify-center w-4 h-4 shrink-0 text-ui-fg-subtle transition-transform duration-150'
  ),
  itemHeaderIconError: cva('flex items-center justify-center text-red-500 dark:text-red-400'),
  itemHeaderIconWarning: cva('flex items-center justify-center text-orange-500 dark:text-orange-400'),
  itemContent: cva('flex', {
    variants: {
      grow: {
        true: 'overflow-auto basis-0 grow',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      grow: true
    }
  }),
  itemDivider: cva(
    'h-1 bg-primary-400 cursor-row-resize w-full opacity-0 hover:opacity-100 transition-opacity duration-200 translate-y-1/2'
  )
};
