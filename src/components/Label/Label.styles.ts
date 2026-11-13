import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'error', 'disabled', 'custom'],
  size: ['md', 'sm', 'xs', 'custom'],
  disabled: [true, false],
  error: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Label';

export default {
  root: cva('font-medium text-ui-fg', {
    variants: {
      intent: {
        primary: '',
        disabled: 'text-ui-fg-subtle',
        error: 'text-red-600 dark:text-red-400',
        custom: ''
      },
      error: {
        true: 'text-red-600 dark:text-red-400',
        false: ''
      },
      disabled: {
        true: 'cursor-not-allowed text-ui-fg-subtle',
        false: ''
      },
      size: {
        md: 'text-sm',
        sm: 'text-sm',
        xs: 'text-xs',
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
