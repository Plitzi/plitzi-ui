import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  disabled: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'MenuList';

export default {
  root: cva('', {
    variants: {},
    compoundVariants: [],
    defaultVariants: {}
  }),
  trigger: cva('cursor-pointer'),
  container: cva('fixed z-[801]', {
    variants: {
      // visible: {
      //   true: 'flex',
      //   false: 'invisible'
      // }
      placement: {
        'top-left': '-translate-y-full',
        'top-right': '-translate-y-full',
        'bottom-left': '',
        'bottom-right': ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      // visible: false
      placement: 'bottom-left'
    }
  }),
  menu: cva('bg-black min-w-[175px]'),
  menuItem: cva('flex items-center py-1.5 pl-3 pr-4 gap-1 hover:bg-gray-800 text-sm', {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-gray-400',
        false: 'cursor-pointer text-white'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      disabled: false
    }
  })
};
