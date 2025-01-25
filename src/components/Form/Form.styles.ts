// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'Form';

export default {
  root: cva('flex flex-col gap-4', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  })
};
