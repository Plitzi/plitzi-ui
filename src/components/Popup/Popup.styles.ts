// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['top', 'left', 'right', 'none']
} as const;

export const STYLES_COMPONENT_NAME = 'Popup';

export default {
  root: cva('pointer-events-auto'),
  btn: cva('h-6 w-6', {
    variants: {
      intent: {},
      collapsed: {}
    },
    compoundVariants: [],
    defaultVariants: {}
  }),
  sidebarRoot: cva(''),
  sidebar: cva('h-full flex grow bg-white', {
    variants: {
      placement: {
        top: 'flex-col',
        left: '',
        right: 'flex-row-reverse'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      placement: 'right'
    }
  }),
  sidebarContainer: cva('flex flex-col grow', {
    variants: {
      placement: {
        top: '',
        left: 'min-w-0 overflow-y-auto',
        right: 'min-w-0 overflow-y-auto'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      placement: 'right'
    }
  })
};
