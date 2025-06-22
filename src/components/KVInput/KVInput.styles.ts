import cva from '@/helpers/cvaWrapper';

import { variantKeys as variantKeysInput } from '../Input/Input.styles';

export const variantKeys = {
  size: variantKeysInput.size
} as const;

export const STYLES_COMPONENT_NAME = 'KVInput';

export default {
  item: cva('w-full flex gap-1 border border-gray-300 p-1 [&:not(:first-child)]:border-t-0', {
    variants: {
      size: {
        md: 'first:rounded-t-lg last:rounded-b-lg',
        sm: 'first:rounded-t last:rounded-b',
        xs: 'first:rounded-t-sm last:rounded-b-sm',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  inputContainer: cva('p-0 border-none'),
  rootInputContainer: cva(''),
  rootInput: cva('w-full')
};
