// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary']
} as const;

export const STYLES_COMPONENT_NAME = 'Tree';

export default {
  root: cva('', {
    variants: {
      intent: {
        primary: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary'
    }
  })
};
