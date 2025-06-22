import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  error: [true, false],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Select';

export default {
  input: cva('py-0 pl-0 border-0 outline-none focus:ring-0 w-full truncate', {
    variants: {
      intent: {
        primary: 'bg-white',
        custom: ''
      },
      error: {
        true: '',
        false: ''
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: ''
      },
      size: {
        md: 'text-base pl-2 pr-8',
        sm: 'text-sm pl-1.5 pr-6',
        xs: 'text-xs pl-1 pr-6',
        custom: ''
      }
    },
    compoundVariants: [
      // {
      //   error: true,
      //   size: 'md',
      //   className: 'mr-6'
      // },
      // {
      //   error: true,
      //   size: 'sm',
      //   className: 'mr-5'
      // },
      // {
      //   error: true,
      //   size: 'xs',
      //   className: 'mr-5'
      // }
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      error: false,
      disabled: false
    }
  })
};
