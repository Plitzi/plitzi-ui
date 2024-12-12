// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = {
  intent: ['default'],
  grow: [true, false],
  size: ['xs', 'md', 'sm', 'lg', 'custom'],
  resizing: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Accordion';

export default {
  root: cva('overflow-auto', {
    variants: {
      intent: {
        default: []
      },
      resizing: {
        true: 'select-none',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      resizing: false
    }
  }),
  item: cva('transition-all'),
  itemHeader: cva('font-medium cursor-pointer select-none leading-3 uppercase', {
    variants: {
      size: {
        xs: 'px-1 py-0.5 text-sm h-5',
        sm: 'px-1.5 py-1 h-6',
        md: 'px-2 py-1.5 text-lg h-7',
        lg: 'px-2 py-1.5 text-lg h-7',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  itemHeaderSlot: cva(''),
  itemHeaderIcon: cva('flex items-center justify-center w-4 h-4'),
  itemHeaderIconError: cva('flex items-center justify-center text-red-500'),
  itemHeaderIconWarning: cva('flex items-center justify-center text-orange-500'),
  itemContent: cva('flex', {
    variants: {
      size: {
        xs: 'px-1',
        sm: 'px-1.5',
        md: 'px-2',
        custom: ''
      },
      grow: {
        true: 'overflow-auto basis-0 grow',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      grow: true,
      size: 'md'
    }
  }),
  itemDivider: cva(
    'divider h-1 bg-primary-400 cursor-row-resize w-full opacity-0 hover:opacity-100 transition-all translate-y-1/2'
  )
};
