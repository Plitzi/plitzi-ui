import { useCallback, useMemo } from 'react';

import Button from '@components/Button';
import useTheme from '@hooks/useTheme';

import ContainerDraggable from '../ContainerDraggable';

import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode } from 'react';

const resizeHandlesDefault: ResizeHandle[] = ['s'];

export type PopupPlacement = 'right' | 'left' | 'floating';

export type PopupProps = {
  id?: string;
  children?: ReactNode;
  width?: number;
  height?: number;
  icon?: ReactNode;
  title?: ReactNode;
  allowResize?: boolean;
  allowLeftSide?: boolean;
  allowRightSide?: boolean;
  allowClose?: boolean;
  allowExternal?: boolean;
  resizeHandles?: ResizeHandle[];
  limitMode?: 'window' | 'parent' | 'none';
  parentElement?: HTMLElement | null;
  placementPopup?: (popupId: string, placement: PopupPlacement) => void;
  onFocus?: (popupId: string, sort?: number) => void;
  removePopup?: (popupId: string) => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

export type PopupSettings = { placement?: PopupPlacement; allowFloatingSide?: boolean } & Omit<PopupProps, 'id'>;

const Popup = ({
  className,
  id = '',
  children,
  width = 300,
  height = 550,
  icon,
  title = '',
  allowResize = true,
  allowLeftSide = true,
  allowRightSide = true,
  allowClose = true,
  allowExternal = true,
  resizeHandles = resizeHandlesDefault, // ['s', 'e', 'w', 'se', 'sw', 'nw', 'ne'],
  limitMode = 'window',
  parentElement,
  // methods
  placementPopup,
  onFocus,
  removePopup
}: PopupProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys>('Popup', {
    className,
    componentKey: ['root', 'btn']
  });

  const { x, y } = useMemo(
    () => ({ x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 }),
    [width, height]
  );

  const handleClickEmbedLeft = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      placementPopup?.(id, 'left');
    },
    [placementPopup, id]
  );

  const handleClickEmbedRight = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      placementPopup?.(id, 'right');
    },
    [placementPopup, id]
  );

  const handleFocus = useCallback(() => onFocus?.(id), [id, onFocus]);

  const handleClose = useCallback(() => removePopup?.(id), [id, removePopup]);

  const customActionsMemo = useMemo(() => {
    const actions = [];
    if (allowLeftSide) {
      actions.push(
        <Button
          key="0"
          intent="custom"
          size="custom"
          border="none"
          className={classNameTheme.btn}
          title="Left Sidebar"
          onClick={handleClickEmbedLeft}
        >
          <Button.Icon icon="fa-solid fa-angles-left" />
        </Button>
      );
    }

    if (allowRightSide) {
      actions.push(
        <Button
          key="1"
          intent="custom"
          size="custom"
          border="none"
          className={classNameTheme.btn}
          title="Right Sidebar"
          onClick={handleClickEmbedRight}
        >
          <Button.Icon icon="fa-solid fa-angles-right" />
        </Button>
      );
    }

    return actions;
  }, [allowLeftSide, allowRightSide, handleClickEmbedLeft, handleClickEmbedRight, classNameTheme.btn]);

  return (
    <ContainerDraggable
      key={id}
      className={classNameTheme.root}
      icon={icon}
      title={title}
      width={width}
      height={height}
      x={x}
      y={y}
      onClose={handleClose}
      onFocus={handleFocus}
      allowResize={allowResize}
      allowExternal={allowExternal}
      allowClose={allowClose}
      resizeHandles={resizeHandles}
      customActions={customActionsMemo}
      limitMode={limitMode}
      parentElement={parentElement}
    >
      {children}
    </ContainerDraggable>
  );
};

// Defines which resize handles should be rendered (default: 'se')
// Allows for any combination of:
// 's' - South handle (bottom-center)
// 'w' - West handle (left-center)
// 'e' - East handle (right-center)
// 'n' - North handle (top-center)
// 'sw' - Southwest handle (bottom-left)
// 'nw' - Northwest handle (top-left)
// 'se' - Southeast handle (bottom-right)
// 'ne' - Northeast handle (top-right)

export default Popup;
