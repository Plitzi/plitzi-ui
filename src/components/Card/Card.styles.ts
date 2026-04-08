import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  size: ['md', 'sm', 'xs', 'custom'],
  intent: ['white', 'modal'],
  shadow: ['normal', 'dark', 'none', 'custom'],
  rounded: ['none', 'sm', 'md', 'lg'],
  overflow: ['none', 'hidden']
} as const;

export const STYLES_COMPONENT_NAME = 'Card';

export default {
  root: cva('', {
    variants: {
      intent: {
        white: 'bg-white dark:bg-zinc-800',
        modal: 'bg-white dark:bg-zinc-800 w-full'
      },
      shadow: {
        normal: 'shadow-md shadow-black/8 dark:shadow-black/30',
        dark: 'shadow-xl shadow-black/15 dark:shadow-black/50',
        none: '',
        custom: ''
      },
      rounded: {
        none: '',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl'
      },
      overflow: {
        none: '',
        hidden: 'overflow-hidden'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'white',
      shadow: 'normal',
      rounded: 'md',
      overflow: 'hidden'
    }
  }),
  header: cva('flex items-center justify-between', {
    variants: {
      intent: {
        white: '',
        modal: 'border-b border-gray-100 dark:border-zinc-700'
      },
      size: {
        md: 'px-5 py-4',
        sm: 'px-4 py-3',
        xs: 'px-3 py-2',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'white',
      size: 'md'
    }
  }),
  headerCloseButton: cva(
    'cursor-pointer text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-100 rounded p-0.5 hover:bg-gray-100 dark:hover:bg-zinc-700'
  ),
  body: cva('', {
    variants: {
      intent: {
        white: '',
        modal: ''
      },
      size: {
        md: 'px-5 py-4',
        sm: 'px-4 py-3',
        xs: 'px-3 py-2',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'white',
      size: 'md'
    }
  }),
  footer: cva('flex items-center gap-2', {
    variants: {
      intent: {
        white: '',
        modal: 'border-t border-gray-100 dark:border-zinc-700'
      },
      size: {
        md: 'px-5 py-4',
        sm: 'px-4 py-3',
        xs: 'px-3 py-2',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'white',
      size: 'md'
    }
  })
};
