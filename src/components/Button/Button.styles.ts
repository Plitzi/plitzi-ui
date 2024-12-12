// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'disabled', 'custom'],
  size: ['xs', 'sm', 'md', 'custom'],
  border: ['solid', 'none', 'custom'],
  items: ['start', 'end', 'center', 'baseline', 'stretch'],
  justify: ['normal', 'start', 'end', 'center', 'between', 'around', 'evenly', 'stretch']
} as const;

export const STYLES_COMPONENT_NAME = 'Button';

const disabledIntent =
  'disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-300 disabled:cursor-not-allowed';

export default {
  root: cva('flex gap-2 outline-none transition-colors transition-150 select-none border', {
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
        md: 'py-2.5 px-4 text-base rounded-lg',
        sm: 'py-1.5 px-3 text-[14px] leading-[18px] rounded-lg',
        xs: 'py-1.5 px-2 text-xs rounded-lg',
        custom: ''
      },
      border: {
        solid: 'border-solid',
        none: 'border-none',
        custom: ''
      },
      items: {
        start: '',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch'
      },
      justify: {
        normal: 'justify-normal',
        start: '',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
        stretch: 'justify-stretch'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      items: 'center',
      justify: 'center',
      intent: 'primary',
      border: 'solid',
      size: 'md'
    }
  }),
  icon: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        md: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  })
};
