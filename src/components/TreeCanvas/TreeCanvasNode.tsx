import { useCallback } from 'react';

import useTheme from '@hooks/useTheme';

import type { LaidOutNode } from './layout';
import type TreeCanvasStyles from './TreeCanvas.styles';
import type { variantKeys } from './TreeCanvas.styles';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';

export type TreeCanvasNodeProps<T> = {
  node: LaidOutNode<T>;
  width: number;
  height: number;
  selected: boolean;
  dragging: boolean;
  dropTarget: boolean;
  dimmed: boolean;
  offsetX?: number;
  offsetY?: number;
  onPointerDown: (id: string, parentId: string | null, e: PointerEvent<HTMLDivElement>) => void;
  onActivate?: (id: string) => void;
  onToggle?: (id: string) => void;
  children: ReactNode;
};

// The fold button is pressed, not dragged: its press must reach neither the node nor the canvas.
const keepPress = (e: PointerEvent) => e.stopPropagation();

/** One item where the layout put it — or under the pointer, while it is dragged — and the button that folds it. */
const TreeCanvasNode = <T,>({
  node,
  width,
  height,
  selected,
  dragging,
  dropTarget,
  dimmed,
  offsetX = 0,
  offsetY = 0,
  onPointerDown,
  onActivate,
  onToggle,
  children
}: TreeCanvasNodeProps<T>) => {
  const classNameTheme = useTheme<typeof TreeCanvasStyles, typeof variantKeys>('TreeCanvas', {
    componentKey: ['node', 'toggle'],
    variants: { selected, dragging, dropTarget, dimmed }
  });
  const { id } = node.item;

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => onPointerDown(id, node.parentId, e),
    [id, node.parentId, onPointerDown]
  );

  const handleDoubleClick = useCallback(() => onActivate?.(id), [id, onActivate]);

  const handleToggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onToggle?.(id);
    },
    [id, onToggle]
  );

  const toggleTitle = node.collapsed ? `Show the ${node.childCount} inside` : 'Fold';
  const toggleIcon = node.collapsed ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';

  return (
    <div
      role="treeitem"
      aria-selected={selected}
      aria-level={node.depth + 1}
      aria-expanded={node.childCount > 0 ? !node.collapsed : undefined}
      data-tree-canvas-node={id}
      className={classNameTheme.node}
      style={{ left: node.x + offsetX, top: node.y + offsetY, width, height }}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
    >
      {children}
      {onToggle && node.childCount > 0 && (
        <button
          type="button"
          className={classNameTheme.toggle}
          title={toggleTitle}
          onPointerDown={keepPress}
          onClick={handleToggle}
        >
          {node.collapsed && <span>{node.childCount}</span>}
          <i className={toggleIcon} />
        </button>
      )}
    </div>
  );
};

export default TreeCanvasNode;
