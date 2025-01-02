// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'error', 'disabled'],
  size: ['md', 'sm', 'xs', 'custom'],
  selected: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Select2';

export default {
  root: cva('', {
    variants: {
      size: {
        md: 'gap-2 text-base',
        sm: 'gap-1.5 text-sm',
        xs: 'gap-1 text-xs'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  inputContainer: cva('flex items-center relative', {
    variants: {
      size: {
        md: 'mr-6',
        sm: 'mr-4',
        xs: 'mr-3'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  placeholder: cva('text-gray-500'),
  searchInput: cva('mx-2.5 mt-2.5'),
  list: cva('p-2.5 max-h-[400px]'),
  listMessage: cva('py-3 text-gray-500 flex items-center justify-center shrink-0'),
  listGroup: cva('not-last:border-b not-last:border-gray-300 not-last:pb-2 not-last:mb-2'),
  listGroupLabel: cva('pr-2 py-2 cursor-default select-none truncate font-bold text-gray-700'),
  listItem: cva('my-0.5 shrink-0 transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded', {
    variants: {
      selected: {
        true: 'bg-blue-100 text-blue-500',
        false: 'text-gray-500 hover:bg-blue-100 hover:text-blue-500'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      selected: false
    }
  })
};
