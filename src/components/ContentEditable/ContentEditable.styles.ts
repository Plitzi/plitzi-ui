import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'ContentEditable';

export default {
  root: cva('', {
    variants: {
      size: {
        md: '',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  })
};
