import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  active: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerTabs';

export default {
  root: cva('flex flex-col', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  content: cva('flex'),
  tab: cva('flex items-center justify-center rounded grow cursor-pointer', {
    variants: {
      active: {
        true: 'bg-white',
        false: 'text-gray-500'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      active: false
    }
  }),
  tabs: cva('flex bg-gray-200 rounded w-[80%] mx-auto p-1 select-none')
};
