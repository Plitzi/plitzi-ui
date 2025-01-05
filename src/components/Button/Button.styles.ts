// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'secondary', 'danger', 'custom'],
  size: ['xs', 'sm', 'md', 'custom'],
  border: ['solid', 'none', 'custom'],
  items: ['start', 'end', 'center', 'baseline', 'stretch'],
  justify: ['normal', 'start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
  disabled: [true, false],
  aspect: ['square', 'custom']
} as const;

export const STYLES_COMPONENT_NAME = 'Button';

export default {
  root: cva('flex outline-none transition-colors transition-150 select-none border', {
    variants: {
      intent: {
        primary: [
          'border-transparent bg-primary-500 text-white',
          'hover:bg-primary-200 hover:text-black',
          'focus:bg-primary-200 focus:text-black'
        ],
        secondary: ['hover:border-black hover:text-black', 'focus:bg-primary-200 focus:text-black'],
        danger: ['border-transparent bg-red-500 text-white', 'hover:bg-danger-200 hover:text-black'],
        custom: ''
      },
      disabled: {
        true: 'disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-300 disabled:cursor-not-allowed',
        false: ''
      },
      aspect: {
        square: 'aspect-square',
        custom: ''
      },
      size: {
        md: 'py-2.5 px-4 gap-2 text-base rounded-lg',
        sm: 'py-1.5 px-3 gap-1.5 text-[14px] leading-[18px] rounded',
        xs: 'py-1 px-1.5 gap-1 text-xs rounded-md min-w-6',
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
      size: 'md',
      disabled: false,
      aspect: 'custom'
    }
  }),
  icon: cva('', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        md: '',
        sm: '',
        xs: '',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  })
};
