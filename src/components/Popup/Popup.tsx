// Packages
import { useCallback, useMemo } from 'react';

// Alias
import Button from '@components/Button';
import { ResizeHandle } from '@components/ContainerResizable';
import useTheme from '@hooks/useTheme';

// Relatives
import ContainerDraggable from '../ContainerDraggable';
import { LIMIT_MODE_WINDOW } from '../ContainerDraggable/ContainerDraggable';

// Types
import type PopupStyles from './Popup.styles';
import type { variantKeys } from './Popup.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

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
  allowExternal?: boolean;
  resizeHandles?: ResizeHandle[];
  limitMode?: 'window' | 'parent' | 'none';
  parentElement?: HTMLElement | null;
  placementPopup?: (placement: PopupPlacement) => void;
  onFocus?: () => void;
  removePopup?: () => void;
} & useThemeSharedProps<typeof PopupStyles, typeof variantKeys>;

export type PopupSettings = { placement?: PopupPlacement } & Omit<PopupProps, 'id'>;

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
  allowExternal = true,
  resizeHandles = resizeHandlesDefault, // ['s', 'e', 'w', 'se', 'sw', 'nw', 'ne'],
  limitMode = LIMIT_MODE_WINDOW,
  parentElement,
  // methods
  placementPopup,
  onFocus,
  removePopup
}: PopupProps) => {
  const classNameTheme = useTheme<typeof PopupStyles, typeof variantKeys, false>('Popup', {
    className,
    componentKey: ['root', 'btn'],
    variant: {}
  });

  const { x, y } = useMemo(
    () => ({ x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2 }),
    [width, height]
  );

  const handleClickEmbedLeft = useCallback(() => placementPopup?.('left'), [placementPopup]);

  const handleClickEmbedRight = useCallback(() => placementPopup?.('right'), [placementPopup]);

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
          content=""
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
          content=""
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
      onClose={removePopup}
      onFocus={onFocus}
      allowResize={allowResize}
      allowExternal={allowExternal}
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
