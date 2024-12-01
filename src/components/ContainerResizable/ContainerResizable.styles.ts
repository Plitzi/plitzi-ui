// Alias
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
        n: 'w-auto left-0 right-0 top-0',
        s: 'w-auto left-0 right-0 bottom-0',
        e: 'h-auto top-0 bottom-0 right-0',
        w: 'h-auto top-0 left-0 bottom-0',
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
  handler: cva('transition-[background-color_0.5s_0.25s_ease-out] rounded-br-lg', {
    variants: {
      intent: {},
      position: {
        n: 'h-1 w-full bg-gray-300 hover:bg-blue-400 cursor-ns-resize',
        s: 'h-1 w-full bg-gray-300 hover:bg-blue-400 cursor-ns-resize',
        e: 'h-full w-1 bg-gray-300 hover:bg-blue-400 cursor-ew-resize',
        w: 'h-full w-1 bg-gray-300 hover:bg-blue-400 cursor-ew-resize',
        sw: '',
        nw: '',
        se: 'h-3 w-3 cursor-se-resize border-b-4 border-r-4 border-gray-300 hover:border-blue-400 active:pointer-events-none',
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
