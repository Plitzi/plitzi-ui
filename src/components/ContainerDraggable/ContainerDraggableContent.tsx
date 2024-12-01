// Packages
import { useCallback } from 'react';

// Alias
import ContainerResizable from '@components/ContainerResizable';
import useTheme from '@hooks/useTheme';

// Types
import type ContainerDraggableStyles from './ContainerDraggable.styles';
import type { variantKeys } from './ContainerDraggable.styles';
import type { ResizeHandle } from '@components/ContainerResizable';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode, Ref } from 'react';

export type ContainerDraggableContentProps = {
  ref: Ref<HTMLDivElement>;
  children: ReactNode;
  allowResize: boolean;
  resizeHandles: ResizeHandle[];
  minConstraintsX: number;
  minConstraintsY: number;
  width: number;
  height: number;
  parentElement?: HTMLElement | null;
  onFocus?: (e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent) => void;
} & useThemeSharedProps<typeof ContainerDraggableStyles, typeof variantKeys>;

const ContainerDraggableContent = ({
  ref,
  className,
  children,
  allowResize,
  intent,
  size,
  collapsed,
  resizeHandles,
  minConstraintsX,
  minConstraintsY,
  width,
  height,
  parentElement,
  onFocus
}: ContainerDraggableContentProps) => {
  className = useTheme<typeof ContainerDraggableStyles, typeof variantKeys>('ContainerDraggable', {
    className,
    componentKey: 'content',
    variant: { intent, size, collapsed }
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!collapsed) {
        onFocus?.(e);
      }
    },
    [onFocus, collapsed]
  );

  return (
    <div ref={ref} className={className} onClick={handleClick}>
      {!allowResize && children}
      {allowResize && (
        <ContainerResizable
          resizeHandles={resizeHandles}
          minConstraintsX={minConstraintsX}
          minConstraintsY={minConstraintsY}
          width={width}
          height={height}
          parentElement={parentElement}
        >
          {children}
        </ContainerResizable>
      )}
    </div>
  );
};

export default ContainerDraggableContent;
