// Packages
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Alias
import Card from '@components/Card';
import ContainerWindow from '@components/ContainerWindow';
import useTheme from '@hooks/useTheme';

// Relatives
import ContainerDraggableContent from './ContainerDraggableContent';
import ContainerDraggableHeader from './ContainerDraggableHeader';

// Types
import type ContainerDraggableStyles from './ContainerDraggable.styles';
import type { variantKeys } from './ContainerDraggable.styles';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export const LIMIT_MODE_PARENT = 'parent';
export const LIMIT_MODE_WINDOW = 'window';
export const LIMIT_MODE_NONE = 'none';

const resizeHandlesDefault: ResizeHandle[] = ['se'];
const customActionsDefault: ReactNode[] = [];

export type ContainerDraggableProps = {
  icon: ReactNode;
  title?: ReactNode;
  className: string;
  children: ReactNode;
  limitMode: 'parent' | 'window' | 'none';
  x: number;
  y: number;
  width: number;
  height: number;
  allowResize: boolean;
  allowExternal: boolean;
  resizeHandles: ResizeHandle[];
  customActions: ReactNode[];
  parentElement?: HTMLElement | null;
  titleHeight?: number;
  onClose?: (e: MouseEvent | React.MouseEvent) => void;
  onFocus?: (e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent) => void;
  onCollapse?: (collapsed: boolean) => void;
} & useThemeSharedProps<typeof ContainerDraggableStyles, typeof variantKeys>;

const ContainerDraggable = ({
  icon,
  title = 'Title',
  className = '',
  children,
  limitMode = LIMIT_MODE_WINDOW,
  x = 0,
  y = 0,
  width = 150,
  height = 150,
  titleHeight = 34,
  allowResize = false,
  allowExternal = true,
  resizeHandles = resizeHandlesDefault,
  customActions = customActionsDefault,
  parentElement,
  intent,
  size,
  onClose = noop,
  onFocus = noop,
  onCollapse = noop
}: ContainerDraggableProps) => {
  className = useTheme<typeof ContainerDraggableStyles, typeof variantKeys>('ContainerDraggable', {
    className,
    componentKey: 'root',
    variant: { intent, size }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const unmounted = useRef(false);
  const xRef = useRef(x);
  const yRef = useRef(y);
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(x);
  const [offsetY, setOffsetY] = useState(y);
  const [TX, setTX] = useState(0);
  const [TY, setTY] = useState(0);
  const [externalWindow, setExternalWindow] = useState(false);
  const [minConstraintsX] = useState(width);
  const [minConstraintsY] = useState(height - titleHeight);
  const [containerRect, setContainerRect] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const parentElementDOM = useMemo(() => {
    if (!parentElement && typeof document !== 'undefined') {
      return document.body;
    }

    return parentElement;
  }, [parentElement]);

  const callbackRefresh = useCallback(() => {
    if (!unmounted.current) {
      const rect = elementRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      let newX = xRef.current;
      let newY = yRef.current;
      if (rect.x + rect.width > window.innerWidth) {
        newX = window.innerWidth - rect.width;
      } else if (rect.x < 0) {
        newX = 0;
      }

      if (rect.y + rect.height > window.innerHeight) {
        newY = window.innerHeight - rect.height;
      } else if (rect.y < 0) {
        newY = 0;
      }

      if (xRef.current !== newX || yRef.current !== newY) {
        xRef.current = newX;
        yRef.current = newY;
        setOffsetX(newX);
        setOffsetY(newY);
      }
    }
  }, []);

  const callbackRefreshDebounced = useRef(debounce(callbackRefresh, 250));

  useEffect(() => {
    const callback = callbackRefreshDebounced.current;
    window.addEventListener('resize', callback);

    return () => {
      unmounted.current = true;
      window.removeEventListener('resize', callback);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (dragging) {
        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }

        let newX = offsetX + e.clientX - TX;
        let newY = offsetY + e.clientY - TY;
        if (newX + rect.width > containerRect.width && limitMode !== LIMIT_MODE_NONE) {
          newX = containerRect.width - rect.width;
        } else if (newX < 0) {
          newX = 0;
        }

        if (newY + rect.height > containerRect.height && limitMode !== LIMIT_MODE_NONE) {
          newY = containerRect.height - rect.height;
        } else if (newY < 0) {
          newY = 0;
        }

        xRef.current = newX;
        yRef.current = newY;

        if (elementRef.current) {
          elementRef.current.style.left = `${newX}px`;
          elementRef.current.style.top = `${newY}px`;
        }
      }
    },
    [TX, TY, containerRect.height, containerRect.width, dragging, limitMode, offsetX, offsetY]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setDragging(false);
      setOffsetX(xRef.current);
      setOffsetY(yRef.current);
      parentElementDOM?.classList.remove('moving');
    },
    [parentElementDOM?.classList]
  );

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove, false);
      window.addEventListener('mouseup', handleMouseUp, false);

      window.addEventListener('touchmove', handleTouchMove, false);
      window.addEventListener('touchend', handleTouchEnd, false);
    }

    return () => {
      if (dragging) {
        window.removeEventListener('mousemove', handleMouseMove, false);
        window.removeEventListener('mouseup', handleMouseUp, false);

        window.removeEventListener('touchmove', handleTouchMove, false);
        window.removeEventListener('touchend', handleTouchEnd, false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, containerRect]);

  const handleMouseDown = (e: MouseEvent | React.MouseEvent) => {
    if (collapsed) {
      return;
    }

    let rect;
    if (limitMode === LIMIT_MODE_PARENT) {
      if (!elementRef.current || !elementRef.current.parentNode) {
        rect = { height: window.innerHeight, width: window.innerWidth };
      }

      // rect = elementRef.current?.parentNode?.getBoundingClientRect();
      rect = (elementRef.current?.parentNode as HTMLElement).getBoundingClientRect();
    } else {
      rect = { height: window.innerHeight, width: window.innerWidth };
    }

    if (e.button === 0) {
      parentElementDOM?.classList.add('moving');
      setDragging(true);
      setContainerRect(rect);
      setTX(e.clientX);
      setTY(e.clientY);
      onFocus(e);
    } else {
      setDragging(false);
      setOffsetX(xRef.current);
      setOffsetY(yRef.current);
    }
  };

  const handleClickExternal = () => setExternalWindow(state => !state);

  const handleTouchMove = useCallback(
    (e: TouchEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (e.changedTouches.length > 1) {
        e.preventDefault();
      }

      if (dragging) {
        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }

        const { clientX, clientY } = e.touches[0];
        let newX = offsetX + clientX - TX;
        let newY = offsetY + clientY - TY;
        if (newX + rect.width > window.innerWidth) {
          newX = window.innerWidth - rect.width;
        } else if (newX < 0) {
          newX = 0;
        }

        if (newY + rect.height > window.innerHeight) {
          newY = window.innerHeight - rect.height;
        } else if (newY < 0) {
          newY = 0;
        }

        xRef.current = newX;
        yRef.current = newY;

        if (elementRef.current) {
          elementRef.current.style.left = `${newX}px`;
          elementRef.current.style.top = `${newY}px`;
        }
      }
    },
    [TX, TY, dragging, offsetX, offsetY]
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    setOffsetX(xRef.current);
    setOffsetY(yRef.current);
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (collapsed) {
        return;
      }

      setDragging(true);
      setTX(e.touches[0].clientX);
      setTY(e.touches[0].clientY);
      onFocus(e);
    },
    [collapsed, onFocus]
  );

  if (externalWindow) {
    return (
      <ContainerWindow
        onClose={handleClickExternal}
        width={width}
        height={height - titleHeight}
        top={yRef.current}
        left={xRef.current}
      >
        {children}
      </ContainerWindow>
    );
  }

  let style = { top: yRef.current, left: xRef.current, width: undefined, height: undefined };
  if (!allowResize) {
    style = { ...style, width: `${width}px`, height: `${height}px` } as typeof style & {
      width: string;
      height: string;
    };
  }

  return (
    <Card
      className={classNames('component__container-draggable', className)}
      intent="white"
      rounded="none"
      shadow="dark"
      ref={elementRef}
      style={style}
    >
      <ContainerDraggableHeader
        intent={intent}
        size={size}
        collapsed={collapsed}
        icon={icon}
        title={title}
        allowExternal={allowExternal}
        customActions={customActions}
        setCollapsed={setCollapsed}
        setExternalWindow={setExternalWindow}
        onClose={onClose}
        onCollapse={onCollapse}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
      <ContainerDraggableContent
        ref={containerRef}
        collapsed={collapsed}
        onFocus={onFocus}
        allowResize={allowResize}
        resizeHandles={resizeHandles}
        minConstraintsX={minConstraintsX}
        minConstraintsY={minConstraintsY}
        width={width}
        height={height - titleHeight}
        parentElement={parentElement}
      >
        {children}
      </ContainerDraggableContent>
    </Card>
  );
};

export default ContainerDraggable;
