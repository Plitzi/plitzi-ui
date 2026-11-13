import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  scrollable: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Form';

export default {
  root: cva('flex flex-col'),
  header: cva('w-full border-b border-ui-line pb-4 mb-4'),
  body: cva('w-full flex flex-col gap-4', {
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
  footer: cva('w-full border-t border-ui-line pt-4 mt-4')
};
