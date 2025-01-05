// Alias
import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['primary', 'gray'],
  size: ['md', 'sm', 'xs', 'custom'],
  disabled: [true, false],
  error: [true, false],
  mainGroup: [true, false],
  showBranches: [true, false],
  direction: ['horizontal', 'vertical']
} as const;

export const STYLES_COMPONENT_NAME = 'QueryBuilder';

export default {
  root: cva('', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        md: '',
        sm: '',
        xs: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  ruleGroup: cva('flex flex-col p-2 border rounded relative', {
    variants: {
      intent: {
        primary: 'bg-primary-500/20 border-gray-400',
        gray: 'bg-grayviolet-200 border-gray-300'
      },
      mainGroup: {
        true: '',
        false: 'mt-2 ml-4'
      },
      showBranches: {
        true: 'before:top-[0px] before:h-[calc(50%_+_10px)]',
        false: ''
      },
      error: {
        true: 'bg-red-500/20 border-red-400',
        false: ''
      }
    },
    compoundVariants: [
      {
        mainGroup: false,
        showBranches: true,
        className: [
          'before:absolute before:border-l before:border-b before:last:rounded-bl before:-translate-x-1/2 before:translate-y-[-10px] before:left-[-4px] before:w-2',
          'after:absolute after:border-l after:-translate-x-1/2 after:translate-y-[calc(100%_-_4px)] after:left-[-4px] after:w-2 last:after:border-none after:top-[0px] after:h-[calc(50%_+_4px)]'
        ]
      },
      {
        mainGroup: false,
        showBranches: true,
        intent: 'primary',
        className: ['before:border-gray-400', 'after:border-gray-400']
      },
      {
        mainGroup: false,
        showBranches: true,
        intent: 'gray',
        className: ['before:border-gray-300', 'after:border-gray-300']
      }
    ],
    defaultVariants: {
      intent: 'primary',
      mainGroup: false,
      showBranches: false,
      error: false
    }
  }),
  ruleGroupHeader: cva(''),
  rule: cva('border p-1 rounded ml-4 not-first:mt-3 relative', {
    variants: {
      intent: {
        primary: 'border-gray-400',
        gray: 'border-gray-300'
      },
      direction: {
        horizontal: 'items-center',
        vertical: 'flex-col'
      },
      showBranches: {
        true: [
          'before:absolute before:border-l before:border-b before:last:rounded-bl before:-translate-x-1/2 before:translate-y-[-0%] before:left-[-4px] before:w-2 before:top-[-13px] before:h-[calc(50%_+_13px)]',
          'after:absolute after:border-l after:-translate-x-1/2 after:translate-y-[calc(50%_+_3px)] after:left-[-4px] after:w-2 last:after:border-none'
        ],
        false: ''
      },
      error: {
        true: 'border-red-400',
        false: ''
      }
    },
    compoundVariants: [
      {
        showBranches: true,
        direction: 'horizontal',
        className: 'after:top-[0px] after:h-[calc(50%_+_6px)]'
      },
      {
        showBranches: true,
        direction: 'vertical',
        className: 'after:top-[0px] after:h-[calc(50%_+_26px)]'
      },
      {
        showBranches: true,
        intent: 'primary',
        className: ['before:border-gray-400', 'after:border-gray-400']
      },
      {
        showBranches: true,
        intent: 'gray',
        className: ['before:border-gray-300', 'after:border-gray-300']
      }
    ],
    defaultVariants: {
      intent: 'primary',
      direction: 'horizontal',
      showBranches: false,
      error: false
    }
  }),
  ruleField: cva('min-w-0'),
  ruleOperator: cva('grow basis-0'),
  button: cva('truncate')
};
