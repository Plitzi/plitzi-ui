// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'danger'],
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Checkbox';

export default {
  root: cva('flex items-center cursor-pointer select-none', {
    variants: {
      size: {
        md: 'gap-2',
        sm: 'gap-1.5',
        xs: 'gap-1',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  input: cva(
    'cursor-pointer form-tick appearance-none bg-white border border-gray-300 checked:border-transparent focus:ring-0 focus:ring-offset-0 focus:shadow-none',
    {
      variants: {
        intent: {
          primary: 'checked:text-primary-500 checked:bg-primary-500 hover:border-primary-500',
          secondary: '',
          danger: 'text-red-400'
        },
        size: {
          md: 'h-6 w-6 rounded-sm',
          sm: 'h-5 w-5 rounded-sm',
          xs: 'h-4 w-4 rounded-xs',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'primary',
        size: 'md'
      }
    }
  )
};
