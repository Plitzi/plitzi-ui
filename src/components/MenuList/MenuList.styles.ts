import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  placement: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  disabled: [true, false],
  active: [true, false]
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
  menu: cva(
    'flex gap-1 flex-col bg-white shadow-[0_7px_14px_0_rgba(65,69,88,0.1),0_3px_6px_0_rgba(0,0,0,0.07)] min-w-[175px] rounded-lg overflow-hidden'
  ),
  menuItem: cva('flex items-center py-1.5 pl-3 pr-4 gap-1 text-sm', {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-gray-400',
        false: 'cursor-pointer hover:bg-grayviolet-200 hover:text-primary-500'
      },
      active: {
        true: 'text-primary-500 bg-grayviolet-200',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      disabled: false
    }
  }),
  icon: cva('text-black')
};
