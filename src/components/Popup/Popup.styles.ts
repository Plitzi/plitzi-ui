// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['left', 'right', 'floating'],
  size: ['xs', 'md', 'sm', 'lg', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Popup';

export default {
  root: cva('pointer-events-auto'),
  btn: cva('', {
    variants: {
      size: {
        lg: 'h-6 w-6',
        md: 'h-5 w-5',
        sm: 'h-4 w-4',
        xs: 'h-3 w-3',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md'
    }
  }),
  sidePanelRoot: cva(''),
  sidePanel: cva('h-full flex grow bg-white', {
    variants: {
      placement: {
        left: '',
        right: 'flex-row-reverse'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      placement: 'right'
    }
  }),
  sidePanelContainer: cva('flex flex-col grow', {
    variants: {
      placement: {
        left: 'min-w-0 overflow-y-auto',
        right: 'min-w-0 overflow-y-auto'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      placement: 'right'
    }
  }),
  sidebar: cva('')
};
