// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'disabled', 'custom'],
  size: ['xs', 'sm', 'base', 'custom'],
  border: ['base', 'sm', 'xs', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Button';

const disabledIntent =
  'disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-300 disabled:cursor-not-allowed';

export default {
  root: cva('flex gap-2 justify-center items-center outline-none transition-colors transition-150 select-none border', {
    variants: {
      intent: {
        primary: [
          'border-transparent bg-primary-500 text-white',
          'hover:bg-primary-200 hover:text-black',
          'focus:bg-primary-200 focus:text-black',
          disabledIntent
        ],
        secondary: ['hover:bg-primary-200 hover:text-black', 'focus:bg-primary-200 focus:text-black', disabledIntent]
      },
      size: {
        base: 'py-2.5 px-4 text-base rounded-lg',
        sm: 'py-1.5 px-3 text-[14px] leading-[18px] rounded-lg',
        xs: 'py-1.5 px-2 text-xs rounded-lg',
        custom: ''
      },
      border: {
        solid: 'border-solid',
        none: 'border-none',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      border: 'solid',
      size: 'base'
    }
  }),
  icon: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        base: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'base'
    }
  })
};
