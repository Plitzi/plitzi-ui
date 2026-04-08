import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  error: [true, false],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ErrorMessage';

export default {
  root: cva('first-letter:capitalize flex items-center gap-1', {
    variants: {
      intent: {
        primary: '',
        custom: ''
      },
      default: {
        true: '',
        false: ''
      },
      error: {
        true: 'text-red-600 dark:text-red-400',
        false: 'text-zinc-500 dark:text-zinc-400'
      },
      size: {
        md: 'text-sm',
        sm: 'text-xs',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      error: false,
      default: false
    }
  })
};
