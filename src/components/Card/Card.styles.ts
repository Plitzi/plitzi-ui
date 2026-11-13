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
  root: cva('flex flex-col', {
    variants: {
      intent: {
        white: 'bg-ui-raised border-ui-line border',
        modal: 'bg-ui-overlay w-full border-ui-line border'
      },
      shadow: {
        normal: 'shadow-md shadow-black/8 dark:shadow-black/30',
        dark: 'shadow-xl shadow-black/15 dark:shadow-black/50',
        none: '',
        custom: ''
      },
      rounded: {
        none: '',
        sm: 'rounded-md',
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
        modal: 'border-b border-ui-line'
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
    'cursor-pointer text-ui-fg-subtle hover:text-ui-fg transition-colors duration-100 rounded-sm p-0.5 hover:bg-ui-hover'
  ),
  body: cva('basis-0 grow', {
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
        modal: 'border-t border-ui-line'
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
