// Packages
import { cva } from 'class-variance-authority';

export const variantKeys = ['intent', 'size'] as const;

export const STYLES_COMPONENT_NAME = 'Button';

export default {
  root: cva(
    'flex gap-2 justify-center items-center outline-none transition-colors transition-150 select-none border rounded-lg',
    {
      variants: {
        intent: {
          default: '',
          primary: ['border-transparent bg-primary-500 text-white', 'hover:bg-primary-200', 'focus:bg-primary-200'],
          secondary: []
        },
        size: {
          xs: '',
          sm: '',
          base: 'py-2.5 px-4'
        },
        state: {
          default: '',
          disabled: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'default',
        size: 'base'
      }
    }
  ),
  icon: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        base: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
