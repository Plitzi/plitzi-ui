import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'ContainerCollapsable';

export default {
  root: cva(''),
  header: cva(
    'flex justify-between items-center cursor-pointer select-none gap-2 px-2 py-1 rounded transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-zinc-700/60'
  ),
  headerContainer: cva('flex items-center gap-2 min-w-0'),
  headerSlot: cva(''),
  headerSlotContainer: cva('flex items-center gap-2 shrink-0'),
  headerTitle: cva(
    'm-0 flex items-center grow cursor-pointer truncate text-sm font-medium text-zinc-700 dark:text-zinc-300'
  ),
  headerIconContainer: cva('flex items-center justify-center w-4 shrink-0 text-zinc-400 dark:text-zinc-500'),
  content: cva('')
};
