import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'ContainerCollapsable';

export default {
  root: cva(''),
  header: cva(
    'flex justify-between items-center cursor-pointer select-none gap-2 px-2 py-1 transition-colors duration-150 hover:bg-ui-hover text-ui-fg'
  ),
  headerContainer: cva('flex items-center gap-2 min-w-0'),
  headerSlot: cva(''),
  headerSlotContainer: cva('flex items-center gap-2 shrink-0'),
  headerTitle: cva('m-0 flex items-center grow cursor-pointer truncate text-sm font-medium text-ui-fg'),
  headerIconContainer: cva('flex items-center justify-center w-4 shrink-0 text-ui-fg-subtle'),
  content: cva('')
};
