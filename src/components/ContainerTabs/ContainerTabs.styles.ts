import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  active: [true, false],
  size: ['xs', 'sm', 'md', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerTabs';

export default {
  root: cva('flex flex-col'),
  content: cva('flex'),
  tabs: cva('flex bg-ui-raised border border-ui-line rounded-lg p-1 select-none gap-0.5'),
  tab: cva(
    'flex items-center justify-center rounded-md basis-0 grow cursor-pointer py-1 px-3 text-sm font-medium transition-colors duration-150 select-none',
    {
      variants: {
        active: {
          true: 'bg-ui-active text-ui-fg shadow-sm',
          false: 'text-ui-fg-subtle hover:text-ui-fg'
        },
        size: {
          md: '',
          sm: 'text-sm',
          xs: 'text-xs',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        active: false,
        size: 'md'
      }
    }
  )
};
