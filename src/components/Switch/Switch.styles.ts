import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'danger', 'custom'],
  size: ['lg', 'md', 'sm', 'xs', 'custom'],
  rounded: [true, false],
  disabled: [true, false],
  error: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Switch';

export default {
  input: cva('opacity-0 w-0 h-0 peer'),
  switch: cva('relative block', {
    variants: {
      size: {
        lg: 'w-12 h-7',
        md: 'w-10 h-6',
        sm: 'w-8 h-5',
        xs: 'w-6 h-4',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  inputContainer: cva('border-0 p-0'),
  slider: cva(
    [
      'round absolute top-0 bottom-0 left-0 right-0 duration-[0.4s]',
      'before:absolute before:left-1 before:bottom-1 before:bg-white before:duration-[0.4s]'
    ],
    {
      variants: {
        intent: {
          primary: '',
          secondary: '',
          danger: ''
        },
        size: {
          lg: 'before:w-5 before:h-5 peer-checked:before:translate-x-[20px]',
          md: 'before:w-4 before:h-4 peer-checked:before:translate-x-[16px]',
          sm: 'before:w-3 before:h-3 peer-checked:before:translate-x-[12px]',
          xs: 'before:w-2 before:h-2 peer-checked:before:translate-x-[8px]',
          custom: ''
        },
        rounded: {
          true: 'before:rounded-full rounded-2xl',
          false: ''
        },
        disabled: {
          true: 'bg-gray-300',
          false: ''
        },
        error: {
          true: 'before:bg-red-500',
          false: ''
        }
      },
      compoundVariants: [
        {
          intent: 'primary',
          disabled: false,
          className: 'bg-gray-300 peer-checked:bg-primary-500 hover:before:bg-primary-500'
        },
        {
          intent: 'secondary',
          disabled: false,
          className: 'bg-gray-300 peer-checked:bg-secondary-500 hover:before:bg-secondary-500'
        },
        {
          intent: 'danger',
          disabled: false,
          className: 'bg-gray-300 peer-checked:bg-red-500 hover:before:bg-red-500'
        }
      ],
      defaultVariants: {
        intent: 'primary',
        rounded: true,
        size: 'md'
      }
    }
  )
};
