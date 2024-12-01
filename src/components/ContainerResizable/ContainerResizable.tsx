// Packages
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// Alias
import useTheme from '@hooks/useTheme';

// Relatives
import { snapToGrid } from './utils';

// Types
import type ContainerResizableStyles from './ContainerResizable.styles';
import type { variantKeys } from './ContainerResizable.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export type ResizeHandle = 'se' | 's' | 'e' | 'n' | 'w' | 'nw' | 'sw' | 'ne';

export type ContainerResizableProps = {
  classNameInternal?: string;
  parentElement?: HTMLElement | null;
  hoverMode?: boolean;
  autoGrow?: boolean;
  width?: number;
  height?: number;
  grid?: number[];
  resizeHandles?: ResizeHandle[];
  transformScale?: number;
  axis?: 'both' | 'x' | 'y' | 'none';
  lockAspectRatio?: boolean;
  minConstraintsX?: number;
  minConstraintsY?: number;
  maxConstraintsX?: number;
  maxConstraintsY?: number;
  children?: ReactNode;
  handle?: ReactNode | ((resizeHandle: string) => ReactNode);
  onChange?: (width: number, height: number) => void;
} & useThemeSharedProps<typeof ContainerResizableStyles, typeof variantKeys>;

const resizeHandlesDefault: ResizeHandle[] = ['se'];

const ContainerResizable = ({
  className,
  classNameInternal = '',
  parentElement,
  hoverMode = false,
  autoGrow = true,
  width: widthProp = Infinity,
  height: heightProp = Infinity,
  grid, // [150, 150]
  resizeHandles = resizeHandlesDefault,
  transformScale = 1,
  axis = 'both',
  lockAspectRatio = false, // If true, will only allow width/height to move in lockstep
  minConstraintsX = 100,
  minConstraintsY = 100,
  maxConstraintsX = Infinity,
  maxConstraintsY = Infinity,
  children,
  handle,
  onChange = noop
}: ContainerResizableProps) => {
  className = useTheme<typeof ContainerResizableStyles, typeof variantKeys>('ContainerResizable', {
    className,
    componentKey: 'root',
    variant: {}
  });
  const [allResizeHandles] = useState(['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']);
  const [width, setWidth] = useState(widthProp);
  const [height, setHeight] = useState(heightProp);
  const [clientX, setClientX] = useState(0);
  const [direction, setDirection] = useState<ResizeHandle>();
  const [oWidth, setOWidth] = useState<number>(0);
  const [oHeight, setOHeight] = useState<number>(0);
  const [clientY, setClientY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerInternalRef = useRef<HTMLDivElement>(null);
  const onChangeDebounced = useRef(debounce(onChange, 150));
  const parentElementDOM = useMemo(() => {
    if (!parentElement && typeof document !== 'undefined') {
      return document.body;
    }

    return parentElement;
  }, [parentElement]);

  const runConstraints = useCallback(
    (auxWidth: number, auxHeight: number, reverse = false) => {
      // If you do this, be careful of constraints
      const [min, max] = [
        [minConstraintsX, minConstraintsY],
        [maxConstraintsX, maxConstraintsY]
      ];

      // Fit width & height to aspect ratio
      if (lockAspectRatio) {
        if (auxHeight === height) {
          const ratio = width / height;
          auxHeight = auxWidth / ratio;
          auxWidth = auxHeight * ratio;
        } else {
          // Take into account vertical resize with N/S handles on locked aspect
          // ratio. Calculate the change height-first, instead of width-first
          const ratio = height / width;
          auxWidth = auxHeight / ratio;
          auxHeight = auxWidth * ratio;
        }
      }

      if (min[0] && min[1]) {
        auxWidth = Math.max(min[0], auxWidth);
        auxHeight = Math.max(min[1], auxHeight);
      }

      if (max[0] && max[1]) {
        auxWidth = Math.min(max[0], auxWidth);
        auxHeight = Math.min(max[1], auxHeight);
      }

      const rect = containerRef.current?.getBoundingClientRect();
      if (!reverse && rect) {
        if (rect.x + auxWidth > window.innerWidth) {
          auxWidth = window.innerWidth - rect.x;
        }

        if (rect.y + auxHeight > window.innerHeight) {
          auxHeight = window.innerHeight - rect.y;
        }
      }

      return [auxWidth, auxHeight];
    },
    [height, lockAspectRatio, maxConstraintsX, maxConstraintsY, minConstraintsX, minConstraintsY, width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const x = e.clientX;
      const y = e.clientY;
      let deltaX = (x - clientX) / transformScale;
      let deltaY = (y - clientY) / transformScale;

      // Axis restrictions
      const canDragX = (axis === 'both' || axis === 'x') && ['n', 's'].indexOf(direction ?? '') === -1;
      const canDragY = (axis === 'both' || axis === 'y') && ['e', 'w'].indexOf(direction ?? '') === -1;
      const reverse = direction?.includes('w') || direction?.includes('n');

      // Grid
      if (Array.isArray(grid)) {
        [deltaX, deltaY] = snapToGrid(deltaX, deltaY, grid);
        if (!deltaX && !deltaY) {
          return; // skip useless drag
        }
      }

      let finalWidth = oWidth + (canDragX ? deltaX : 0);
      let finalHeight = oHeight + (canDragY ? deltaY : 0);
      if (reverse) {
        finalWidth = oWidth - (canDragX ? deltaX : 0);
        finalHeight = oHeight - (canDragY ? deltaY : 0);
      }

      if (finalWidth === oWidth && finalHeight === oHeight) {
        return;
      }

      // Min and Max
      [finalWidth, finalHeight] = runConstraints(finalWidth, finalHeight, reverse);
      onChangeDebounced.current(finalWidth, finalHeight);
      if (oWidth !== Infinity && containerInternalRef.current) {
        containerInternalRef.current.style.width = `${finalWidth}px`;
      }

      if (oHeight !== Infinity && containerInternalRef.current) {
        containerInternalRef.current.style.height = `${finalHeight}px`;
      }
    },
    [axis, clientX, clientY, direction, grid, oHeight, oWidth, runConstraints, transformScale]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setDirection(undefined);
      if (width !== Infinity) {
        setWidth(containerInternalRef.current?.offsetWidth ?? width);
      }

      if (height !== Infinity) {
        setHeight(containerInternalRef.current?.offsetHeight ?? height);
      }

      parentElementDOM?.classList.remove('resizing');
    },
    [height, width, parentElementDOM?.classList]
  );

  const handleMouseDown = useCallback(
    (direction: ResizeHandle): MouseEventHandler<HTMLDivElement> =>
      e => {
        if (!containerRef.current) {
          return;
        }

        parentElementDOM?.classList.add('resizing');
        setDirection(direction);
        setClientX(e.clientX);
        setClientY(e.clientY);
        const { width: currentWidth, height: currentHeight } = containerRef.current.getBoundingClientRect();
        if (width === -1) {
          setOWidth(currentWidth);
        } else {
          setOWidth(width);
        }

        if (height === -1) {
          setOHeight(currentHeight);
        } else {
          setOHeight(height);
        }
      },
    [height, parentElementDOM?.classList, width]
  );

  useEffect(() => {
    if (direction) {
      window.addEventListener('mousemove', handleMouseMove, false);
      window.addEventListener('mouseup', handleMouseUp, false);
    }

    return () => {
      if (direction) {
        window.removeEventListener('mousemove', handleMouseMove, false);
        window.removeEventListener('mouseup', handleMouseUp, false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, parentElementDOM]);

  useEffect(() => {
    setWidth(widthProp);
    setHeight(heightProp);
  }, [widthProp, heightProp]);

  const renderResizeHandle = useCallback(
    (resizeHandle: ResizeHandle) => {
      if (handle) {
        if (typeof handle === 'function') {
          return handle(resizeHandle);
        }

        return handle;
      }

      return (
        <div
          key={resizeHandle}
          className={classNames('absolute flex justify-center items-center z-[40]', {
            'hidden group-5-hover:flex': hoverMode,
            'w-auto left-0 right-0 top-0': resizeHandle === 'n',
            'w-auto left-0 right-0 bottom-0': resizeHandle === 's',
            'right-0 bottom-0': resizeHandle === 'se',
            'h-auto top-0 bottom-0 right-0': resizeHandle === 'e',
            'h-auto top-0 left-0 bottom-0': resizeHandle === 'w'
          })}
          onMouseDown={handleMouseDown(resizeHandle)}
        >
          <div
            className={classNames('transition-[background-color_0.5s_0.25s_ease-out]', {
              'h-1 w-full bg-gray-300 hover:bg-blue-400 cursor-ns-resize': resizeHandle === 's' || resizeHandle === 'n',
              'h-full w-1 bg-gray-300 hover:bg-blue-400 cursor-ew-resize': resizeHandle === 'e' || resizeHandle === 'w',
              'h-3 w-3 cursor-se-resize border-b-4 border-r-4 border-gray-300 hover:border-blue-400 active:pointer-events-none':
                resizeHandle === 'se'
            })}
          />
        </div>
      );
    },
    [handle, handleMouseDown, hoverMode]
  );

  const style = {} as CSSProperties;
  if (height !== Infinity) {
    style.height = `${height}px`;
  }

  if (width !== Infinity) {
    style.width = `${width}px`;
  }

  return (
    <div
      ref={containerRef}
      className={classNames('relative flex flex-col', className, { 'group-5': hoverMode, grow: autoGrow })}
    >
      <div
        ref={containerInternalRef}
        className={classNames('flex flex-col grow overflow-auto', classNameInternal, {
          'pt-1': resizeHandles.includes('n'),
          'pb-1': resizeHandles.includes('s'),
          'pl-1': resizeHandles.includes('w'),
          'pr-1': resizeHandles.includes('e')
        })}
        style={style}
      >
        {children}
      </div>
      {resizeHandles.filter(h => allResizeHandles.includes(h)).map(h => renderResizeHandle(h))}
    </div>
  );
};

// Defines which resize handles should be rendered (default: 'se')
// 's' - South handle (bottom-center)
// 'w' - West handle (left-center)
// 'e' - East handle (right-center)
// 'n' - North handle (top-center)
// 'sw' - Southwest handle (bottom-left)
// 'nw' - Northwest handle (top-left)
// 'se' - Southeast handle (bottom-right)
// 'ne' - Northeast handle (top-center)

// Restricts resizing to a particular axis (default: 'both')
// 'both' - allows resizing by width or height
// 'x' - only allows the width to be changed
// 'y' - only allows the height to be changed
// 'none' - disables resizing altogether

export default ContainerResizable;
