// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: [],
  size: []
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerCollapsable';

export default {
  root: cva('flex flex-col', {
    variants: {
      intent: {},
      size: {}
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  header: cva('flex justify-between items-center cursor-pointer select-none gap-2 px-1'),
  headerContainer: cva('flex items-center gap-2'),
  headerSlot: cva('flex gap-2'),
  headerTitle: cva('m-0 flex items-center grow cursor-pointer'),
  headerIconContainer: cva(''),
  content: cva('')
};
