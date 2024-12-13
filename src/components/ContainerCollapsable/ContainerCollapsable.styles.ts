// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'ContainerCollapsable';

export default {
  root: cva(''),
  header: cva('flex justify-between items-center cursor-pointer select-none gap-2 px-1'),
  headerContainer: cva('flex items-center gap-2'),
  headerSlot: cva(''),
  headerSlotContainer: cva('flex items-center gap-2'),
  headerTitle: cva('m-0 flex items-center grow cursor-pointer'),
  headerIconContainer: cva('flex items-center justify-center w-4'),
  content: cva('')
};
