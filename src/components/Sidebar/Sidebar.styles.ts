import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['left', 'right', 'top', 'bottom'],
  border: ['solid', 'none'],
  padding: ['normal', 'none'],
  size: ['xs', 'md', 'sm', 'lg', 'custom'],
  active: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Sidebar';

export default {
  root: cva(
    'flex flex-col gap-5 border-gray-200 dark:border-zinc-800 bg-grayviolet-100 dark:bg-zinc-900 w-14 items-center overflow-y-auto shrink-0',
    {
      variants: {
        border: {
          solid: 'border-solid',
          none: ''
        },
        placement: {
          top: 'border-b',
          bottom: 'border-t',
          left: 'border-r',
          right: 'border-l'
        },
        padding: {
          normal: '',
          none: ''
        }
      },
      compoundVariants: [
        {
          placement: 'top',
          padding: 'normal',
          className: 'px-4'
        },
        {
          placement: 'bottom',
          padding: 'normal',
          className: 'px-4'
        },
        {
          placement: 'left',
          padding: 'normal',
          className: 'py-4'
        },
        {
          placement: 'right',
          padding: 'normal',
          className: 'py-4'
        }
      ],
      defaultVariants: {
        placement: 'left',
        border: 'solid',
        padding: 'normal'
      }
    }
  ),
  icon: cva('shrink-0 transition-colors duration-150', {
    variants: {
      // The open entry reads at a glance: a tinted ground, not only a colour on a glyph.
      active: {
        true: 'bg-primary-50 dark:bg-primary-400/15',
        false: ''
      },
      size: {
        lg: 'h-10 w-10 rounded-lg',
        md: 'h-8 w-8 rounded-lg',
        sm: 'h-6 w-6 rounded-sm',
        xs: 'h-4 w-4 rounded-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: 'md',
      active: false
    }
  }),
  separator: cva('w-6 bg-gray-200 dark:bg-zinc-700 h-px shrink-0')
};
