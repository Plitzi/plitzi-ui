import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Modal';

export default {
  root: cva('fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[601]', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  background: cva('bg-black opacity-60 w-full h-full absolute z-[602]'),
  card: cva('z-[603]')
};
