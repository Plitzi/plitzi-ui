import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['white'],
  size: [],
  shadow: ['normal', 'dark', 'custom'],
  rounded: ['none', 'md'],
  overflow: ['none', 'hidden']
} as const;

export const STYLES_COMPONENT_NAME = 'Card';

export default {
  root: cva('', {
    variants: {
      intent: {
        white: 'bg-white'
      },
      size: {},
      shadow: {
        normal: 'shadow-[0_7px_14px_0_rgba(65,69,88,0.1),0_3px_6px_0_rgba(0,0,0,0.07)]',
        dark: 'shadow-[0px_0px_10px_0px_rgba(43,53,86,0.3)]',
        custom: ''
      },
      rounded: {
        none: '',
        md: 'rounded-md'
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
  })
};
