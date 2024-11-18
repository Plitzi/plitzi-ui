// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'danger'],
  size: ['base', 'sm', 'xl']
} as const;

export const STYLES_COMPONENT_NAME = 'Dummy';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: '',
        danger: 'text-red-400'
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
