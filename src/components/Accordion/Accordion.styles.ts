// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = {
  intent: ['default'],
  grow: [true, false],
  size: ['xs', 'md', 'sm']
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
  item: cva('transition-all'),
  itemHeader: cva('font-medium cursor-pointer select-none leading-3 uppercase', {
    variants: {
      size: {
        xs: 'px-1 py-0.5 text-sm h-5',
        sm: 'px-1.5 py-1 h-6',
        md: 'px-2 py-1.5 text-lg h-7'
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
  itemContent: cva('', {
    variants: {
      size: {
        xs: 'px-1',
        sm: 'px-1.5',
        md: 'px-2'
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
  })
};
