// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary'],
  size: ['md', 'sm', 'xs', 'custom'],
  dragging: [true, false],
  parent: [true, false],
  hovered: [true, false],
  selected: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Tree';

export default {
  root: cva('h-full relative grow basis-0 user-select-none overflow-auto group', {
    variants: {
      intent: {
        primary: ''
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
      intent: 'primary',
      size: 'md'
    }
  }),
  item: cva('cursor-pointer pr-1 flex', {
    variants: {
      parent: {
        true: '',
        false: 'node--empty' // @todo: remove ?
      },
      selected: {
        true: 'bg-primary-200 text-white',
        false: ''
      },
      hovered: {
        true: '',
        false: ''
      },
      dragging: {
        true: 'node--dragging', // @todo: remove ?
        false: ''
      }
    },
    compoundVariants: [
      {
        hovered: true,
        selected: false,
        className: 'bg-primary-100 text-black'
      }
    ],
    defaultVariants: {
      parent: false,
      selected: false,
      hovered: false,
      dragging: false
    }
  })
};
