// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'disabled'],
  size: ['xs', 'sm', 'base']
} as const;

export const STYLES_COMPONENT_NAME = 'Button';

export default {
  root: cva(
    'flex gap-2 justify-center items-center outline-none transition-colors transition-150 select-none border rounded-lg',
    {
      variants: {
        intent: {
          primary: [
            'border-transparent bg-primary-500 text-white',
            'hover:bg-primary-200 hover:text-black',
            'focus:bg-primary-200 focus:text-black'
          ],
          secondary: ['hover:bg-primary-200 hover:text-black', 'focus:bg-primary-200 focus:text-black'],
          disabled: ['bg-gray-300 text-gray-400 cursor-not-allowed']
        },
        size: {
          base: 'py-2.5 px-4 text-base',
          sm: 'py-1.5 px-3 text-sm',
          xs: 'py-1.5 px-2 text-xs'
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'primary',
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
