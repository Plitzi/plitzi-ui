// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = ['intent', 'size'] as const;

export const STYLES_COMPONENT_NAME = 'Dummy';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: [],
        danger: 'text-red-400'
      },
      size: {
        default: '',
        small: 'text-xs',
        big: 'text-xl'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'default'
    }
  })
};
