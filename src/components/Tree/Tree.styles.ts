import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary'],
  size: ['md', 'sm', 'xs', 'custom'],
  hovered: [true, false],
  selected: [true, false],
  parentSelected: [true, false],
  dragAllowed: [true, false],
  isOpen: [true, false],
  dropPosition: ['top', 'bottom', 'inside']
} as const;

export const STYLES_COMPONENT_NAME = 'Tree';

export default {
  root: cva('h-full relative grow basis-0 user-select-none overflow-auto group', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        md: 'text-sm',
        sm: 'text-xs',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  item: cva('cursor-pointer flex items-center transition-colors duration-100', {
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
      parentSelected: {
        true: '',
        false: ''
      },
      size: {
        md: 'px-3 py-0.5 gap-1.5 min-h-7',
        sm: 'px-2.5 py-0.5 gap-1 min-h-6',
        xs: 'px-2 py-0.5 gap-1 min-h-5',
        custom: ''
      }
    },
    compoundVariants: [
      {
        hovered: true,
        selected: false,
        intent: 'primary',
        className: 'bg-gray-100 dark:bg-zinc-700/60 text-zinc-900 dark:text-zinc-200'
      },
      {
        hovered: true,
        selected: false,
        intent: 'secondary',
        className: 'bg-gray-100 dark:bg-zinc-700/60 text-zinc-900 dark:text-zinc-200'
      },
      {
        parentSelected: true,
        selected: false,
        intent: 'primary',
        className:
          'bg-primary-100 hover:bg-primary-200 dark:hover:bg-primary-900/40 dark:bg-primary-900/20 text-zinc-900 dark:text-zinc-200'
      },
      {
        parentSelected: true,
        selected: false,
        intent: 'secondary',
        className:
          'bg-secondary-100 hover:bg-secondary-200 dark:hover:bg-secondary-900/40 dark:bg-secondary-900/20 text-zinc-900 dark:text-zinc-200'
      },
      {
        parentSelected: true,
        selected: false,
        hovered: true,
        intent: 'primary',
        className:
          'bg-primary-200/70 hover:bg-primary-200 dark:hover:bg-primary-900/40 dark:bg-primary-900/30 text-zinc-900 dark:text-zinc-200'
      },
      {
        parentSelected: true,
        selected: false,
        hovered: true,
        intent: 'secondary',
        className:
          'bg-secondary-200/70 hover:bg-secondary-200 dark:hover:bg-secondary-900/40 dark:bg-secondary-900/30 text-zinc-900 dark:text-zinc-200'
      },
      {
        selected: true,
        intent: 'primary',
        className: 'bg-primary-200 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
      },
      {
        selected: true,
        intent: 'secondary',
        className: 'bg-secondary-200 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300'
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
    'focus-visible:outline-dashed focus-visible:outline-1 focus-visible:-outline-offset-1 truncate focus-visible:text-clip focus-visible:overflow-auto focus-visible:outline-primary-500',
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
    'h-0.5 w-full p-0 absolute pointer-events-none after:h-2 after:w-2 after:-translate-y-[calc(50%-1px)] after:absolute after:border-2 after:border-solid after:content-[""] after:rounded-full',
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
        { dragAllowed: false, intent: 'primary', dropPosition: 'top', className: 'bg-red-500 after:border-red-500' },
        { dragAllowed: false, intent: 'secondary', dropPosition: 'top', className: 'bg-red-500 after:border-red-500' },
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
        { dragAllowed: false, intent: 'primary', dropPosition: 'bottom', className: 'bg-red-500 after:border-red-500' },
        {
          dragAllowed: false,
          intent: 'secondary',
          dropPosition: 'bottom',
          className: 'bg-red-500 after:border-red-500'
        },
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
        { dragAllowed: false, intent: 'primary', dropPosition: 'inside', className: 'bg-red-500/20 border-red-500' },
        { dragAllowed: false, intent: 'secondary', dropPosition: 'inside', className: 'bg-red-500/20 border-red-500' }
      ],
      defaultVariants: {
        intent: 'primary',
        dragAllowed: true
      }
    }
  ),
  collapsableIcon: cva('w-4 items-center justify-center cursor-pointer text-zinc-400 dark:text-zinc-500 shrink-0', {
    variants: {
      isOpen: {
        true: 'flex',
        false: 'group-hover:flex hidden'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      isOpen: false
    }
  }),
  icon: cva('shrink-0 text-zinc-500 dark:text-zinc-400', {
    variants: {
      size: {
        md: 'w-4 h-4',
        sm: 'w-3.5 h-3.5',
        xs: 'w-3 h-3',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  })
};
