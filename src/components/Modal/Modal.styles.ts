import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'Modal';

export default {
  root: cva('fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  background: cva('bg-black opacity-70 w-full h-full absolute z-[601]'),
  card: cva('z-[602]')
};
