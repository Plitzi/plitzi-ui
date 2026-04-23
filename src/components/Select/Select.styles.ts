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
        primary: 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200',
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
        md: 'text-base pr-8 bg-size-[1.75rem_1.75rem] bg-position-[right_0rem_center]',
        sm: 'text-sm pr-6 bg-size-[1.5rem_1.5rem] bg-position-[right_0rem_center]',
        xs: 'text-xs pr-4 bg-size-[1.25rem_1.25rem] bg-position-[right_0rem_center]',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      error: false,
      disabled: false
    }
  })
};
