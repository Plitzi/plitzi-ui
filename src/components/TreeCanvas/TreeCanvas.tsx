import { useCallback, useEffect, useMemo, useRef } from 'react';

import useTheme from '@hooks/useTheme';

import { layoutTree } from './layout';
import TreeCanvasControls from './TreeCanvasControls';
import TreeCanvasEdge from './TreeCanvasEdge';
import TreeCanvasNode from './TreeCanvasNode';
import TreeCanvasRootDrop from './TreeCanvasRootDrop';
import useTreeCanvasDrag from './useTreeCanvasDrag';
import useTreeCanvasViewport from './useTreeCanvasViewport';

import type { LaidOutNode, TreeCanvasItem } from './layout';
import type TreeCanvasStyles from './TreeCanvas.styles';
import type { variantKeys } from './TreeCanvas.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { KeyboardEvent, ReactNode } from 'react';

export type TreeCanvasNodeState = {
  selected: boolean;
  dragging: boolean;
  /** The item a dragged one would be dropped into. */
  dropTarget: boolean;
  /** Outside `highlightIds` while there are some. */
  dimmed: boolean;
  /** Its children are folded away. */
  collapsed: boolean;
  childCount: number;
};

export type TreeCanvasProps<T> = {
  items: TreeCanvasItem<T>[];
  renderNode: (item: TreeCanvasItem<T>, state: TreeCanvasNodeState) => ReactNode;
  /** Every node's box: the layout is computed from it, so a node never draws outside it. */
  nodeWidth?: number;
  nodeHeight?: number;
  gapX?: number;
  gapY?: number;
  /** How many leaves one column holds before another starts beside it. */
  columnSize?: number;
  minZoom?: number;
  maxZoom?: number;
  selectedId?: string;
  onSelect?: (id: string | undefined) => void;
  /** Double click, or Enter on the selected item: open it, whatever opening means here. */
  onActivate?: (id: string) => void;
  /** Dragging an item onto a container, or onto the top-level zone (`null`). Without it nothing can be dragged. */
  onMove?: (id: string, parentId: string | null) => void;
  /** Delete or Backspace on the selected item. */
  onDelete?: (id: string) => void;
  /** Items whose children are folded away. Without `onToggleCollapsed` nothing can be folded. */
  collapsedIds?: readonly string[];
  onToggleCollapsed?: (id: string) => void;
  /** While set, every other item is dimmed — what a search found, say. */
  highlightIds?: ReadonlySet<string>;
  /** Brought into view whenever it changes, unless it is on screen already. */
  revealId?: string;
  /** What the drop zone for the top level says. */
  rootDropLabel?: string;
  ariaLabel?: string;
  testId?: string;
  /** Laid over the canvas — toolbars, legends: position them absolutely. */
  children?: ReactNode;
} & useThemeSharedProps<typeof TreeCanvasStyles, typeof variantKeys>;

const ZOOM_STEP = 1.2;

/** The way from the top level down to an item: every ancestor's id, and its own. */
const pathTo = <T,>(byId: Map<string, LaidOutNode<T>>, id: string | undefined): Set<string> => {
  const path = new Set<string>();
  let current = id ? byId.get(id) : undefined;
  while (current) {
    path.add(current.item.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return path;
};

/**
 * A forest drawn as a chart you can move around in: laid out on its own — no node is ever placed by hand — panned and
 * zoomed like a design canvas, walked with the keyboard, folded branch by branch, with items moved by dropping them
 * into another.
 */
const TreeCanvas = <T,>({
  items,
  renderNode,
  nodeWidth = 200,
  nodeHeight = 150,
  gapX = 48,
  gapY = 64,
  columnSize,
  minZoom = 0.1,
  maxZoom = 2,
  selectedId,
  onSelect,
  onActivate,
  onMove,
  onDelete,
  collapsedIds,
  onToggleCollapsed,
  highlightIds,
  revealId,
  rootDropLabel = 'Move to the top level',
  ariaLabel = 'Tree',
  testId,
  className,
  children
}: TreeCanvasProps<T>) => {
  const classNameTheme = useTheme<typeof TreeCanvasStyles, typeof variantKeys>('TreeCanvas', {
    className,
    componentKey: ['root', 'layer', 'edges']
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const rootDropRef = useRef<HTMLDivElement>(null);
  const collapsed = useMemo(() => new Set(collapsedIds), [collapsedIds]);
  const layout = useMemo(
    () => layoutTree(items, { nodeWidth, nodeHeight, gapX, gapY, columnSize, collapsed }),
    [collapsed, columnSize, gapX, gapY, items, nodeHeight, nodeWidth]
  );
  const byId = useMemo(() => new Map(layout.nodes.map(node => [node.item.id, node])), [layout.nodes]);
  const selectedPath = useMemo(() => pathTo(byId, selectedId), [byId, selectedId]);

  const handleBackgroundClick = useCallback(() => onSelect?.(undefined), [onSelect]);

  const { viewport, zoomBy, fit, reveal, toCanvas, handleBackgroundPointerDown } = useTreeCanvasViewport(rootRef, {
    minZoom,
    maxZoom,
    contentWidth: layout.width,
    contentHeight: layout.height,
    onBackgroundClick: handleBackgroundClick
  });
  const { drag, handleNodePointerDown } = useTreeCanvasDrag({
    items,
    nodes: layout.nodes,
    nodeWidth,
    nodeHeight,
    rootDropRef,
    toCanvas,
    onSelect,
    onMove
  });

  const revealNode = useCallback(
    (id: string | undefined) => {
      const node = id ? byId.get(id) : undefined;
      if (node) {
        reveal(node.x, node.y, nodeWidth, nodeHeight);
      }
    },
    [byId, nodeHeight, nodeWidth, reveal]
  );

  useEffect(() => revealNode(revealId), [revealId, revealNode]);

  const handleZoomIn = useCallback(() => zoomBy(ZOOM_STEP), [zoomBy]);
  const handleZoomOut = useCallback(() => zoomBy(1 / ZOOM_STEP), [zoomBy]);

  /** Selects an item from the keyboard and keeps it in view. */
  const step = useCallback(
    (id: string | undefined) => {
      if (id) {
        onSelect?.(id);
        revealNode(id);
      }
    },
    [onSelect, revealNode]
  );

  const handleArrow = useCallback(
    (key: string) => {
      const current = selectedId ? byId.get(selectedId) : undefined;
      if (!current) {
        step(layout.nodes.at(0)?.item.id);

        return;
      }

      const siblings = layout.nodes.filter(node => node.parentId === current.parentId);
      const index = siblings.indexOf(current);
      if (key === 'ArrowUp') {
        step(current.parentId ?? undefined);
      } else if (key === 'ArrowDown') {
        step(layout.nodes.find(node => node.parentId === current.item.id)?.item.id);
      } else if (key === 'ArrowLeft') {
        step(siblings.at(Math.max(0, index - 1))?.item.id);
      } else {
        step(siblings.at(Math.min(siblings.length - 1, index + 1))?.item.id);
      }
    },
    [byId, layout.nodes, selectedId, step]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        handleArrow(e.key);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        onDelete?.(selectedId);
      } else if (e.key === 'Enter' && selectedId) {
        onActivate?.(selectedId);
      } else if (e.key === ' ' && selectedId && byId.get(selectedId)?.childCount) {
        e.preventDefault();
        onToggleCollapsed?.(selectedId);
      } else if (e.key === 'Escape') {
        onSelect?.(undefined);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        fit();
      }
    },
    [byId, fit, handleArrow, handleZoomIn, handleZoomOut, onActivate, onDelete, onSelect, onToggleCollapsed, selectedId]
  );

  const draggedParent = drag ? byId.get(drag.id)?.parentId : undefined;
  const isDimmed = (id: string) => highlightIds !== undefined && !highlightIds.has(id);

  return (
    <div
      ref={rootRef}
      role="tree"
      aria-label={ariaLabel}
      tabIndex={0}
      data-testid={testId}
      className={classNameTheme.root}
      style={{
        backgroundImage: 'radial-gradient(circle, var(--tree-canvas-dot) 1px, transparent 1px)',
        backgroundSize: `${16 * viewport.zoom}px ${16 * viewport.zoom}px`,
        backgroundPosition: `${viewport.x}px ${viewport.y}px`
      }}
      onPointerDown={handleBackgroundPointerDown}
      onKeyDown={handleKeyDown}
    >
      <div
        className={classNameTheme.layer}
        style={{
          width: layout.width,
          height: layout.height,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
        }}
      >
        <svg className={classNameTheme.edges} width={layout.width} height={layout.height} aria-hidden>
          {layout.edges.map(edge => (
            <TreeCanvasEdge
              key={edge.id}
              path={edge.path}
              highlighted={selectedPath.has(edge.to) || edge.from === selectedId}
              dimmed={isDimmed(edge.to)}
            />
          ))}
        </svg>
        {layout.nodes.map(node => {
          const dragging = drag?.id === node.item.id;
          const state: TreeCanvasNodeState = {
            selected: node.item.id === selectedId,
            dragging,
            dropTarget: drag?.target?.kind === 'item' && drag.target.id === node.item.id,
            dimmed: isDimmed(node.item.id),
            collapsed: node.collapsed,
            childCount: node.childCount
          };

          return (
            <TreeCanvasNode
              key={node.item.id}
              node={node}
              width={nodeWidth}
              height={nodeHeight}
              selected={state.selected}
              dragging={dragging}
              dropTarget={state.dropTarget}
              dimmed={state.dimmed}
              offsetX={dragging ? drag.offsetX : 0}
              offsetY={dragging ? drag.offsetY : 0}
              onPointerDown={handleNodePointerDown}
              onActivate={onActivate}
              onToggle={onToggleCollapsed}
            >
              {renderNode(node.item, state)}
            </TreeCanvasNode>
          );
        })}
      </div>
      {drag && draggedParent !== null && (
        <TreeCanvasRootDrop ref={rootDropRef} active={drag.target?.kind === 'root'} label={rootDropLabel} />
      )}
      <TreeCanvasControls zoom={viewport.zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onFit={fit} />
      {children}
    </div>
  );
};

export default TreeCanvas;
