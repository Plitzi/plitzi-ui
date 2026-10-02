import { useCallback, useEffect, useRef, useState } from 'react';

import { isWithin } from './layout';

import type { LaidOutNode, TreeCanvasItem } from './layout';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

/** Where a dragged item would land: inside an item, at the top level, or nowhere — dropping there cancels. */
export type TreeCanvasDropTarget = { kind: 'item'; id: string } | { kind: 'root' } | null;

export type TreeCanvasDrag = { id: string; offsetX: number; offsetY: number; target: TreeCanvasDropTarget };

export type UseTreeCanvasDragOptions<T> = {
  items: TreeCanvasItem<T>[];
  nodes: LaidOutNode<T>[];
  nodeWidth: number;
  nodeHeight: number;
  rootDropRef: RefObject<HTMLDivElement | null>;
  toCanvas: (clientX: number, clientY: number) => { x: number; y: number };
  onSelect?: (id: string | undefined) => void;
  onMove?: (id: string, parentId: string | null) => void;
};

const DRAG_SLOP = 4;

/**
 * Moving an item by dragging it onto the one it should live in — or onto the top-level zone. A press that does not move
 * is a click, and selects. Escape, or letting go over nothing, leaves everything where it was.
 */
const useTreeCanvasDrag = <T>({
  items,
  nodes,
  nodeWidth,
  nodeHeight,
  rootDropRef,
  toCanvas,
  onSelect,
  onMove
}: UseTreeCanvasDragOptions<T>) => {
  const [drag, setDrag] = useState<TreeCanvasDrag | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanup.current?.(), []);

  const targetAt = useCallback(
    (id: string, clientX: number, clientY: number): TreeCanvasDropTarget => {
      const zone = rootDropRef.current?.getBoundingClientRect();
      if (zone && clientX >= zone.left && clientX <= zone.right && clientY >= zone.top && clientY <= zone.bottom) {
        return { kind: 'root' };
      }

      const point = toCanvas(clientX, clientY);
      const over = nodes.find(
        node =>
          node.item.container === true &&
          point.x >= node.x &&
          point.x <= node.x + nodeWidth &&
          point.y >= node.y &&
          point.y <= node.y + nodeHeight &&
          !isWithin(items, id, node.item.id)
      );

      return over ? { kind: 'item', id: over.item.id } : null;
    },
    [items, nodeHeight, nodeWidth, nodes, rootDropRef, toCanvas]
  );

  const handleNodePointerDown = useCallback(
    (id: string, parentId: string | null, e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) {
        return;
      }

      // The node's press, not the canvas': the canvas would start panning under it.
      e.stopPropagation();
      cleanup.current?.();
      const start = { clientX: e.clientX, clientY: e.clientY, canvas: toCanvas(e.clientX, e.clientY) };
      let current: TreeCanvasDrag | null = null;
      const listening = new AbortController();

      const stop = () => {
        listening.abort();
        cleanup.current = null;
        setDrag(null);
      };

      const handleMove = (event: PointerEvent) => {
        if (!current && Math.hypot(event.clientX - start.clientX, event.clientY - start.clientY) <= DRAG_SLOP) {
          return;
        }

        const point = toCanvas(event.clientX, event.clientY);
        current = {
          id,
          offsetX: point.x - start.canvas.x,
          offsetY: point.y - start.canvas.y,
          target: onMove ? targetAt(id, event.clientX, event.clientY) : null
        };
        setDrag(current);
      };

      const handleUp = () => {
        const target = current?.target ?? null;
        const dragged = current !== null;
        stop();
        if (!dragged) {
          onSelect?.(id);

          return;
        }

        if (target?.kind === 'root' && parentId !== null) {
          onMove?.(id, null);
        } else if (target?.kind === 'item' && target.id !== parentId) {
          onMove?.(id, target.id);
        }
      };

      const handleKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          stop();
        }
      };

      window.addEventListener('pointermove', handleMove, { signal: listening.signal });
      window.addEventListener('pointerup', handleUp, { signal: listening.signal });
      window.addEventListener('keydown', handleKey, { signal: listening.signal });
      cleanup.current = stop;
    },
    [onMove, onSelect, targetAt, toCanvas]
  );

  return { drag, handleNodePointerDown };
};

export default useTreeCanvasDrag;
