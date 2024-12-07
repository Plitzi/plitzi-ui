// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {} as const;

export const STYLES_COMPONENT_NAME = 'Sidebar';

export default {
  root: cva(
    'flex flex-col gap-5 py-4 border-r border-gray-200 border-solid bg-white w-14 items-center overflow-y-auto'
  ),
  icon: cva('h-10 w-10 rounded-lg shrink-0'),
  separator: cva('w-6 bg-gray-200 h-px shrink-0')
};
