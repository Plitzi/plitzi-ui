// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'error', 'disabled'],
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Select2';

export default {
  root: cva('', {
    variants: {
      size: {
        md: 'gap-2 text-base',
        sm: 'gap-1.5 text-sm',
        xs: 'gap-1 text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  searchInput: cva('mx-2.5 mt-2.5'),
  list: cva('p-2.5 max-h-[400px]')
};
