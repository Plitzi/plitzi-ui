import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  scrollable: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Form';

export default {
  root: cva('flex flex-col'),
  header: cva('w-full'),
  body: cva('w-full', {
    variants: {
      scrollable: {
        true: 'grow basis-0 overflow-y-auto',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      scrollable: false
    }
  }),
  footer: cva('w-full')
};
