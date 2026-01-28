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
  item: cva(''),
  itemHeader: cva('font-bold cursor-pointer select-none leading-3', {
    variants: {
      size: {
        xs: 'p-1 text-sm h-6',
        sm: 'p-1.5 h-7',
        md: 'p-2 text-lg h-11',
        lg: 'p-2 text-lg h-11',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'lg'
    }
  }),
  itemHeaderSlot: cva(''),
  itemHeaderIcon: cva('flex items-center justify-center w-4 h-4'),
  itemHeaderIconError: cva('flex items-center justify-center text-red-500'),
  itemHeaderIconWarning: cva('flex items-center justify-center text-orange-500'),
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
    'divider h-1 bg-primary-400 cursor-row-resize w-full opacity-0 hover:opacity-100 transition-all translate-y-1/2'
  )
};
