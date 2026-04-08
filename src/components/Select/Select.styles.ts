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
        primary: 'bg-white dark:bg-zinc-800 dark:text-zinc-200',
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
        md: 'text-base pl-3 pr-8',
        sm: 'text-sm pl-2.5 pr-7',
        xs: 'text-xs pl-2 pr-6',
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
