import cva from '@/helpers/cvaWrapper';

export const variantKeys = {
  position: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'],
  hover: [true, false]
} as const;

export const STYLES_COMPONENT_NAME = 'ContainerResizable';

export default {
  root: cva('relative flex flex-col'),
  rootInternal: cva('flex flex-col grow overflow-auto'),
  handlerContainer: cva('absolute flex justify-center items-center z-[40]', {
    variants: {
      intent: {},
      position: {
        n: 'w-auto h-1 left-0 right-0 top-0',
        s: 'w-auto h-1 left-0 right-0 bottom-0',
        e: 'h-auto w-1 top-0 bottom-0 right-0',
        w: 'h-auto w-1 top-0 left-0 bottom-0',
        sw: '',
        nw: '',
        se: 'right-0 bottom-0',
        ne: ''
      },
      hover: {
        true: 'hidden group-5-hover:flex',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      hover: false,
      position: 'se'
    }
  }),
  handler: cva('transition-[width,background-color] duration-500', {
    variants: {
      intent: {},
      position: {
        n: 'h-0.5 hover:h-1 w-full bg-gray-300 hover:bg-primary-500 cursor-ns-resize',
        s: 'h-0.5 hover:h-1 w-full bg-gray-300 hover:bg-primary-500 cursor-ns-resize',
        e: 'h-full w-0.5 hover:w-1 bg-gray-300 hover:bg-primary-500 cursor-ew-resize',
        w: 'h-full w-0.5 hover:w-1 bg-gray-300 hover:bg-primary-500 cursor-ew-resize',
        sw: '',
        nw: '',
        se: 'h-3 w-3 cursor-se-resize border-b-4 border-r-4 border-gray-300 hover:border-primary-500 active:pointer-events-none rounded-br-lg',
        ne: ''
      },
      hover: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [],
    defaultVariants: {
      hover: false,
      position: 'se'
    }
  })
};
