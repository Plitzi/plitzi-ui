// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['left', 'right']
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
  sidebar: cva('', {
    variants: {
      placement: {
        left: '',
        right: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {}
  })
};
