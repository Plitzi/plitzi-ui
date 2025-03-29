/* eslint-disable quotes */
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['md', 'sm', 'xs']
} as const;

export const STYLES_COMPONENT_NAME = 'ColorPicker';

export default {
  inputColorContainer: cva('flex w-full items-center', {
    variants: {
      intent: {
        primary: '',
        custom: ''
      },
      size: {
        md: 'gap-2',
        sm: 'gap-1.5',
        xs: 'gap-1'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  colorContainer: cva(
    [
      "bg-[url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A')]",
      'border border-gray-300 flex rounded overflow-hidden shrink-0'
    ],
    {
      variants: {
        size: {
          md: 'h-6 w-6',
          sm: 'h-5 w-5',
          xs: 'h-4 w-4'
        },
        disabled: {
          true: '',
          false: 'cursor-pointer'
        }
      },
      compoundVariants: [],
      defaultVariants: {
        size: 'md',
        disabled: false
      }
    }
  ),
  divider: cva('bg-gray-300 w-px self-stretch shrink-0'),
  input: cva('p-0 border-0 outline-none focus:ring-0 basis-0 grow min-w-0', {
    variants: {
      intent: {
        primary: 'bg-white'
      },
      // error: {
      //   true: '',
      //   false: ''
      // },
      // disabled: {
      //   true: 'cursor-not-allowed',
      //   false: ''
      // },
      size: {
        md: 'text-base',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
      // disabled: false,
      // error: false
    }
  }),
  alpha: cva('flex items-center justify-center whitespace-nowrap shrink-0', {
    variants: {
      size: {
        md: '',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  })
};
