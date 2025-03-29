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
        md: 'text-base pl-2 pr-8 bg-[length:24px_24px] bg-[right_0_center] rounded-lg',
        sm: 'text-sm pl-1.5 pr-6 bg-[length:20px_20px] bg-[right_0_center] rounded',
        xs: 'text-xs pl-1 pr-4 bg-[length:16px_16px] bg-[right_0_center] rounded-sm',
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
