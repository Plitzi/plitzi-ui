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
  root: cva(
    'flex outline-none select-none border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2',
    {
      variants: {
        intent: {
          primary: [
            'border-transparent bg-primary-500 text-white',
            'hover:bg-primary-600',
            'focus-visible:ring-primary-500',
            'dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus-visible:ring-primary-400'
          ],
          secondary: [
            'border-gray-300 text-zinc-700 hover:border-gray-400 hover:bg-gray-50 hover:text-zinc-900',
            'focus-visible:ring-gray-400',
            'dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-400 dark:hover:bg-zinc-700/50 dark:hover:text-white dark:focus-visible:ring-zinc-500'
          ],
          danger: [
            'border-transparent bg-red-500 text-white hover:bg-red-600',
            'focus-visible:ring-red-500',
            'dark:bg-red-600 dark:hover:bg-red-700'
          ],
          custom: ''
        },
        disabled: {
          true: ['disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'],
          false: 'cursor-pointer'
        },
        aspect: {
          square: 'aspect-square',
          custom: ''
        },
        size: {
          md: 'py-2 px-4 gap-2 text-sm rounded-lg',
          sm: 'py-1.5 px-3 gap-1.5 text-sm rounded',
          xs: 'py-1 px-2 gap-1 text-xs rounded-sm min-w-6',
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
    }
  ),
  icon: cva('shrink-0', {
    variants: {
      intent: {
        default: ''
      },
      size: {
        md: 'text-sm',
        sm: 'text-xs',
        xs: 'text-xs',
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
