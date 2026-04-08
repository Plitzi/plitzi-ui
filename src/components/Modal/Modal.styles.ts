import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  size: ['md', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Modal';

export default {
  root: cva('fixed inset-0 flex items-center justify-center z-601 p-4'),
  background: cva('bg-black/60 dark:bg-black/70 w-full h-full absolute inset-0 z-602 backdrop-blur-sm'),
  card: cva('z-603 w-full max-w-lg')
};
