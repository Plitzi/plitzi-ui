import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  canDragAndDrop: [true, false],
  intent: [],
  size: ['custom', 'md', 'sm', 'xs'],
  error: [true, false],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'FileUpload';

export default {
  root: cva('', {
    variants: {
      canDragAndDrop: {
        true: 'flex flex-col border-2 border-gray-300 border-dashed rounded-md relative select-none',
        false: 'w-full'
      },
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      },
      disabled: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      { disabled: true, canDragAndDrop: true, className: 'cursor-not-allowed' },
      { disabled: false, canDragAndDrop: true, className: 'cursor-pointer' },
      { canDragAndDrop: true, size: 'md', className: 'px-4 py-10 gap-4' },
      { canDragAndDrop: true, size: 'sm', className: 'px-2 py-8 gap-3' },
      { canDragAndDrop: true, size: 'xs', className: 'px-1 py-6 gap-2' }
    ],
    defaultVariants: {
      disabled: false,
      canDragAndDrop: false,
      size: 'md'
    }
  }),
  input: cva('w-full ring-0 outline-0', {
    variants: {
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      disabled: false
    }
  }),
  inputContainer: cva('items-start'),
  iconFloatingContainer: cva('', {
    variants: {
      size: {
        md: 'h-6',
        sm: 'h-5',
        xs: 'h-4',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  items: cva('flex w-full gap-4 flex-wrap justify-center'),
  item: cva('flex flex-col overflow-hidden gap-1 shrink-0', {
    variants: {
      size: {
        md: 'w-30',
        sm: 'w-25 text-sm',
        xs: 'w-20 text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  itemImg: cva('w-auto rounded', {
    variants: {
      size: {
        md: 'h-30',
        sm: 'h-25',
        xs: 'h-20',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  itemLabel: cva('whitespace-nowrap w-full truncate'),
  label: cva('mt-2 text-center flex flex-col', {
    variants: {
      error: {
        true: 'text-red-500',
        false: ''
      },
      size: {
        md: '',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      },
      disabled: {
        true: 'text-gray-400',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md',
      error: false,
      disabled: false
    }
  }),
  subLabel: cva('lowercase text-[9px] text-center w-full items-center justify-center', {
    variants: {
      size: {
        md: 'text-sm',
        sm: 'text-xs',
        xs: 'text-xs',
        custom: ''
      },
      disabled: {
        true: 'text-gray-400',
        false: 'text-gray-500'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md',
      disabled: false
    }
  })
};
