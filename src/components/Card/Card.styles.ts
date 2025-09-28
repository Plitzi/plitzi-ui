import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  size: ['md', 'sm', 'xs', 'custom'],
  intent: ['white', 'modal'],
  shadow: ['normal', 'dark', 'custom'],
  rounded: ['none', 'md'],
  overflow: ['none', 'hidden']
} as const;

export const STYLES_COMPONENT_NAME = 'Card';

export default {
  root: cva('', {
    variants: {
      intent: {
        white: 'bg-white',
        modal: 'bg-white min-w-[350px]'
      },
      shadow: {
        normal: 'shadow-[0_7px_14px_0_rgba(65,69,88,0.1),0_3px_6px_0_rgba(0,0,0,0.07)]',
        dark: 'shadow-[0px_0px_10px_0px_rgba(43,53,86,0.3)]',
        custom: ''
      },
      rounded: {
        md: 'rounded-md',
        none: ''
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
  header: cva('', {
    variants: {
      intent: {
        white: '',
        modal: 'border-b border-solid border-gray-200'
      },
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      }
    },
    compoundVariants: [
      {
        intent: 'modal',
        size: 'md',
        className: 'p-4 text-md'
      },
      {
        intent: 'modal',
        size: 'sm',
        className: 'p-3 text-sm'
      },
      {
        intent: 'modal',
        size: 'xs',
        className: 'p-2 text-xs'
      }
    ],
    defaultVariants: {
      intent: 'white',
      size: 'md'
    }
  }),
  headerCloseButton: cva('cursor-pointer'),
  body: cva('', {
    variants: {
      intent: {
        white: '',
        modal: ''
      },
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      }
    },
    compoundVariants: [
      {
        intent: 'modal',
        size: 'md',
        className: 'p-4 text-md'
      },
      {
        intent: 'modal',
        size: 'sm',
        className: 'p-3 text-sm'
      },
      {
        intent: 'modal',
        size: 'xs',
        className: 'p-2 text-xs'
      }
    ],
    defaultVariants: {
      intent: 'white',
      size: 'md'
    }
  }),
  footer: cva('', {
    variants: {
      intent: {
        white: '',
        modal: 'border-t border-solid border-gray-200'
      },
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      }
    },
    compoundVariants: [
      {
        intent: 'modal',
        size: 'md',
        className: 'p-4 text-md'
      },
      {
        intent: 'modal',
        size: 'sm',
        className: 'p-3 text-sm'
      },
      {
        intent: 'modal',
        size: 'xs',
        className: 'p-2 text-xs'
      }
    ],
    defaultVariants: {
      intent: 'white',
      size: 'md'
    }
  })
};
