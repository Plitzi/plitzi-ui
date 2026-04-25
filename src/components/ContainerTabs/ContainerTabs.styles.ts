import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  active: [true, false],
  size: ['xs', 'sm', 'md', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerTabs';

export default {
  root: cva('flex flex-col'),
  content: cva('flex'),
  tabs: cva(
    'flex bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-1 select-none gap-0.5'
  ),
  tab: cva(
    'flex items-center justify-center rounded  basis-0 grow cursor-pointer py-1 px-3 text-sm font-medium transition-colors duration-150 select-none',
    {
      variants: {
        active: {
          true: 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm',
          false: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
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
