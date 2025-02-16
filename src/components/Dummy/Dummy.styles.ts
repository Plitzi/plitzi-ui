import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'danger'],
  size: ['xl', 'md', 'sm', 'xs']
} as const;

export const STYLES_COMPONENT_NAME = 'Dummy';

export default {
  root: cva('', {
    variants: {
      intent: {
        default: '',
        danger: 'text-red-400'
      },
      size: {
        xl: 'text-xl',
        md: '',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  })
};
