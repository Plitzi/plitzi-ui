// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default'],
  size: ['xs', 'base', 'sm', 'xl']
} as const;

export const STYLES_COMPONENT_NAME = 'Icon';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        xs: 'text-xs',
        base: '',
        xl: 'text-xl'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
