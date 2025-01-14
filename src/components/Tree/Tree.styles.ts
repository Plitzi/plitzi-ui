// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary'],
  size: ['md', 'sm', 'xs', 'custom'],
  hovered: [true, false],
  selected: [true, false],
  dragAllowed: [true, false],
  dropPosition: ['top', 'bottom', 'inside']
} as const;

export const STYLES_COMPONENT_NAME = 'Tree';

export default {
  root: cva('builder_tree h-full relative grow basis-0 user-select-none overflow-auto group', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  item: cva('tree_node cursor-pointer pr-1 flex', {
    variants: {
      selected: {
        true: 'bg-primary-200 text-white',
        false: ''
      },
      hovered: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      {
        hovered: true,
        selected: false,
        className: 'bg-primary-100 text-black'
      }
    ],
    defaultVariants: {
      selected: false,
      hovered: false
    }
  }),
  containerEditable: cva([
    'focus-visible:px-1 focus-visible:m-[1px] focus-visible:outline-dashed focus-visible:outline-1',
    'truncate focus-visible:text-clip focus-visible:overflow-auto focus-visible:text-black focus-visible:outline-blue-500'
  ]),
  dropIndicator: cva(
    [
      'h-0.5 w-full p-0 absolute pointer-events-none',
      'after:h-2 after:w-2 after:-translate-y-[calc(50%-1px)] after:absolute after:border-2 after:border-solid after:content-[""] after:rounded-full'
    ],
    {
      variants: {
        dragAllowed: {
          true: 'bg-primary-500 after:border-primary-500',
          false: 'bg-red-500 after:border-red-500'
        },
        dropPosition: {
          inside: 'top-1/2 -translate-y-1/2 left-6 after:-left-2',
          top: 'top-1 left-2 after:-left-2',
          bottom: 'bottom-1 left-2 after:-left-2 after:-bottom-1.5'
        }
      },
      compoundVariants: [],
      defaultVariants: {}
    }
  )
};
