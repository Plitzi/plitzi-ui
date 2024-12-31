// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'danger'],
  size: ['md', 'sm', 'xs']
} as const;

export const STYLES_COMPONENT_NAME = 'Checkbox';

export default {
  input: cva(
    'cursor-pointer form-tick appearance-none bg-white border border-gray-300 rounded checked:border-transparent focus:ring-0 focus:ring-offset-0 focus:shadow-none',
    {
      variants: {
        intent: {
          primary: 'checked:text-primary-500 checked:bg-primary-500 hover:border-primary-500',
          secondary: '',
          danger: 'text-red-400'
        },
        size: {
          md: 'h-6 w-6',
          sm: 'h-4 w-4',
          xs: 'h-3 w-3'
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
