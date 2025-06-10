import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  intent: ['default', 'danger', 'secondary'],
  size: ['lg', 'md', 'sm', 'xs', 'custom'],
  rounded: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'Switch';

export default {
  root: cva('flex gap-1 cursor-pointer select-none items-center', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        lg: 'text-lg',
        md: '',
        sm: 'text-sm',
        xs: 'text-xs',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  input: cva('opacity-0 w-0 h-0 peer'),
  switch: cva('relative block', {
    variants: {
      intent: {
        primary: ''
      },
      size: {
        lg: 'w-12 h-7',
        md: 'w-10 h-6',
        sm: 'w-8 h-5',
        xs: 'w-6 h-4',
        custom: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }),
  slider: cva(
    [
      'round absolute top-0 bottom-0 left-0 right-0 duration-[0.4s]',
      'before:absolute before:left-1 before:bottom-1 before:bg-white before:duration-[0.4s]'
    ],
    {
      variants: {
        intent: {
          primary: 'bg-gray-300 peer-checked:bg-primary-500',
          secondary: 'bg-gray-300 peer-checked:bg-secondary-500',
          danger: 'bg-gray-300 peer-checked:bg-danger-500'
        },
        size: {
          lg: 'before:w-5 before:h-5 peer-checked:before:translate-x-[20px]',
          md: 'before:w-4 before:h-4 peer-checked:before:translate-x-[16px]',
          sm: 'before:w-3 before:h-3 peer-checked:before:translate-x-[12px]',
          xs: 'before:w-2 before:h-2 peer-checked:before:translate-x-[8px]',
          custom: ''
        },
        rounded: {
          true: 'before:rounded-full rounded-2xl',
          false: ''
        }
      },
      compoundVariants: [],
      defaultVariants: {
        intent: 'primary',
        rounded: true,
        size: 'md'
      }
    }
  )
};
