// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary'],
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
  item: cva('tree_node cursor-pointer flex', {
    variants: {
      intent: {
        primary: '',
        secondary: ''
      },
      selected: {
        true: '',
        false: ''
      },
      hovered: {
        true: '',
        false: ''
      },
      size: {
        md: 'px-4',
        sm: 'px-3',
        xs: 'px-2',
        custom: ''
      }
    },
    compoundVariants: [
      {
        hovered: true,
        selected: false,
        intent: 'primary',
        className: 'bg-primary-100 text-black'
      },
      {
        hovered: true,
        selected: false,
        intent: 'secondary',
        className: 'bg-secondary-100 text-black'
      },
      {
        selected: true,
        intent: 'primary',
        className: 'bg-primary-200 text-white'
      },
      {
        selected: true,
        intent: 'secondary',
        className: 'bg-secondary-200 text-black'
      }
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      selected: false,
      hovered: false
    }
  }),
  containerEditable: cva(
    [
      'focus-visible:outline-dashed focus-visible:outline-1 focus-visible:-outline-offset-[1px]',
      'truncate focus-visible:text-clip focus-visible:overflow-auto focus-visible:text-black focus-visible:outline-primary-500'
    ],
    {
      variants: {
        size: {
          md: 'focus-visible:px-1',
          sm: 'focus-visible:px-0.5',
          xs: '',
          custom: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {}
    }
  ),
  dropIndicator: cva(
    [
      'h-0.5 w-full p-0 absolute pointer-events-none',
      'after:h-2 after:w-2 after:-translate-y-[calc(50%-1px)] after:absolute after:border-2 after:border-solid after:content-[""] after:rounded-full'
    ],
    {
      variants: {
        intent: {
          primary: '',
          secondary: ''
        },
        dragAllowed: {
          true: '',
          false: ''
        },
        dropPosition: {
          inside: 'top-0 left-0 w-full h-full border-2 border-solid after:content-none',
          top: 'top-1 left-2 after:-left-2',
          bottom: 'bottom-1 left-2 after:-left-2 after:-bottom-1.5'
        }
      },
      compoundVariants: [
        // top - no error
        {
          dragAllowed: true,
          intent: 'primary',
          dropPosition: 'top',
          className: 'bg-primary-500 after:border-primary-500'
        },
        {
          dragAllowed: true,
          intent: 'secondary',
          dropPosition: 'top',
          className: 'bg-secondary-500 after:border-secondary-500'
        },
        // top - error
        {
          dragAllowed: false,
          intent: 'primary',
          dropPosition: 'top',
          className: 'bg-red-500 after:border-red-500'
        },
        {
          dragAllowed: false,
          intent: 'secondary',
          dropPosition: 'top',
          className: 'bg-red-500 after:border-red-500'
        },
        // bottom - no error
        {
          dragAllowed: true,
          intent: 'primary',
          dropPosition: 'bottom',
          className: 'bg-primary-500 after:border-primary-500'
        },
        {
          dragAllowed: true,
          intent: 'secondary',
          dropPosition: 'bottom',
          className: 'bg-secondary-500 after:border-secondary-500'
        },
        // bottom - error
        {
          dragAllowed: false,
          intent: 'primary',
          dropPosition: 'bottom',
          className: 'bg-red-500 after:border-red-500'
        },
        {
          dragAllowed: false,
          intent: 'secondary',
          dropPosition: 'bottom',
          className: 'bg-red-500 after:border-red-500'
        },
        // inside - no error
        {
          dragAllowed: true,
          intent: 'primary',
          dropPosition: 'inside',
          className: 'bg-primary-500/20 border-primary-500'
        },
        {
          dragAllowed: true,
          intent: 'secondary',
          dropPosition: 'inside',
          className: 'bg-secondary-500/20 border-secondary-500'
        },
        // inside - error
        {
          dragAllowed: false,
          intent: 'primary',
          dropPosition: 'inside',
          className: 'bg-red-500/20 border-red-500'
        },
        {
          dragAllowed: false,
          intent: 'secondary',
          dropPosition: 'inside',
          className: 'bg-red-500/20 border-red-500'
        }
      ],
      defaultVariants: {
        intent: 'primary',
        dragAllowed: true
      }
    }
  ),
  collapsableIcon: cva('w-4 group-hover:flex hidden items-center cursor-pointer')
};
