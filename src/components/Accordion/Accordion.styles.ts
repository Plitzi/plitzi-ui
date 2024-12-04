// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = { intent: ['default'] } as const;

export const STYLES_COMPONENT_NAME = 'Accordion';

export default {
  root: cva('', {
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
  itemHeader: cva(
    'flex justify-between items-center bg-gray-300 pl-3 pr-4 text-sm font-medium cursor-pointer select-none leading-3 h-9 uppercase'
  ),
  itemHeaderSlot: cva('flex items-center gap-2'),
  itemHeaderIcon: cva('flex items-center justify-center w-4 h-4'),
  itemHeaderIconError: cva('flex items-center justify-center text-red-500'),
  itemHeaderIconWarning: cva('flex items-center justify-center text-orange-500'),
  itemContent: cva('')
};
