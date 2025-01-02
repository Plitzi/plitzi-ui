// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'error', 'disabled'],
  size: ['md', 'sm', 'xs']
} as const;

export const STYLES_COMPONENT_NAME = 'Select';

export default {
  input: cva('py-0 pl-0 border-0 outline-none focus:ring-0 w-full', {
    variants: {
      intent: {
        primary: '',
        error: '',
        disabled: 'cursor-not-allowed'
      },
      size: {
        md: 'text-base pl-2 pr-10 bg-[length:24px_24px] bg-[right_0_center]',
        sm: 'text-sm pl-1.5 pr-8 bg-[length:20px_20px] bg-[right_0_center]',
        xs: 'text-xs pl-1 pr-6 bg-[length:16px_16px] bg-[right_0_center]'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  })
};
