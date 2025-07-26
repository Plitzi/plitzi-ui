import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'CodeMirror';

export default {
  root: cva('h-full grow basis-0 overflow-auto', {
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
