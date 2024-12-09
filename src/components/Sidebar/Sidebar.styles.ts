// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['left', 'right', 'top', 'bottom'],
  border: ['solid', 'none'],
  padding: ['normal', 'none']
} as const;

export const STYLES_COMPONENT_NAME = 'Sidebar';

export default {
  root: cva('flex flex-col gap-5 border-gray-200 bg-grayviolet-100 w-14 items-center overflow-y-auto flex-shrink-0', {
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
  }),
  icon: cva('h-10 w-10 rounded-lg shrink-0'),
  separator: cva('w-6 bg-gray-200 h-px shrink-0')
};
