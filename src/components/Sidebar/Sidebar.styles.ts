// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['left', 'right', 'top', 'bottom']
} as const;

export const STYLES_COMPONENT_NAME = 'Sidebar';

export default {
  root: cva('flex flex-col gap-5 py-4 border-gray-200 bg-grayviolet-100 w-14 items-center overflow-y-auto', {
    variants: {
      border: {
        solid: 'border-solid',
        none: ''
      },
      placement: {
        top: 'border-b',
        bottom: 'border-t',
        left: 'border-r',
        right: 'border-l'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      placement: 'left',
      border: 'solid'
    }
  }),
  icon: cva('h-10 w-10 rounded-lg shrink-0'),
  separator: cva('w-6 bg-gray-200 h-px shrink-0')
};
