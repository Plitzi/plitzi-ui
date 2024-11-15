// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = ['intent', 'size'] as const;

export const STYLES_COMPONENT_NAME = 'Alert';

export default {
  root: cva('w-full flex relative rounded', {
    variants: {
      intent: {
        default: '',
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-orange-400',
        info: 'bg-blue-400'
      },
      size: {
        default: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'default'
    }
  })
};
