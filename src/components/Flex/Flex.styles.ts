// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  direction: ['column', 'row', 'row-reverse', 'col-reverse'],
  wrap: ['wrap', 'nowrap', 'wrap-reverse'],
  items: ['start', 'end', 'center', 'baseline', 'stretch'],
  justify: ['normal', 'start', 'end', 'center', 'between', 'around', 'evenly', 'stretch'],
  gap: [0, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16],
  grow: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Flex';

export default {
  root: cva('flex', {
    variants: {
      direction: {
        column: 'flex-col',
        row: '',
        'row-reverse': 'flex-row-reverse',
        'col-reverse': 'flex-col-reverse'
      },
      grow: {
        true: 'flex-grow',
        false: ''
      },
      wrap: {
        wrap: 'flex-wrap',
        nowrap: '',
        'wrap-reverse': 'flex-wrap-reverse'
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
      },
      gap: {
        0: '',
        1: 'gap-1',
        1.5: 'gap-1.5',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        7: 'gap-7',
        8: 'gap-8',
        9: 'gap-9',
        10: 'gap-10',
        11: 'gap-11',
        12: 'gap-12',
        14: 'gap-14',
        16: 'gap-16'
      }
    },
    compoundVariants: [],
    defaultVariants: {
      direction: 'row',
      wrap: 'nowrap',
      justify: 'start',
      items: 'start',
      gap: 0,
      grow: false
    }
  })
};
