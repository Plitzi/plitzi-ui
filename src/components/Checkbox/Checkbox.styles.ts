import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'danger'],
  size: ['md', 'sm', 'xs', 'custom'],
  error: [true, false],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Checkbox';

export default {
  inputContainer: cva('border-0 p-0'),
  input: cva(
    'cursor-pointer form-tick appearance-none bg-white border border-gray-300 checked:border-transparent focus:ring-0 focus:ring-offset-0 focus:shadow-none',
    {
      variants: {
        intent: {
          primary: '',
          secondary: '',
          danger: ''
        },
        size: {
          md: 'h-6 w-6 rounded-sm',
          sm: 'h-5 w-5 rounded-sm',
          xs: 'h-4 w-4 rounded-xs',
          custom: ''
        },
        disabled: {
          true: 'checked:text-gray-500 checked:bg-gray-500 hover:border-gray-500',
          false: ''
        }
      },
      compoundVariants: [
        {
          intent: 'primary',
          disabled: false,
          className: 'checked:text-primary-500 checked:bg-primary-500 hover:border-primary-500'
        },
        {
          intent: 'secondary',
          disabled: false,
          className: 'checked:text-secondary-500 checked:bg-secondary-500 hover:border-secondary-500'
        },
        {
          intent: 'danger',
          disabled: false,
          className: 'checked:text-red-500 checked:bg-red-500 hover:border-red-500'
        }
      ],
      defaultVariants: {
        intent: 'primary',
        size: 'md'
      }
    }
  )
};
