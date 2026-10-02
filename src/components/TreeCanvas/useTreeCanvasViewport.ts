import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export type TreeCanvasViewport = { x: number; y: number; zoom: number };

export type UseTreeCanvasViewportOptions = {
  minZoom: number;
  maxZoom: number;
  contentWidth: number;
  contentHeight: number;
  /** Kept free around the content when it is fitted. */
  padding?: number;
  /** A click on the empty canvas, as opposed to a drag across it. */
  onBackgroundClick?: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// A press that moves less than this is a click: a hand never holds perfectly still.
const CLICK_SLOP = 4;

/**
 * Where the canvas looks: panned by dragging its background or scrolling, zoomed with ⌘/Ctrl and the wheel — or a
 * pinch, which browsers report the same way — around the pointer, so what is under it stays under it.
 */
const useTreeCanvasViewport = (
  rootRef: RefObject<HTMLDivElement | null>,
  { minZoom, maxZoom, contentWidth, contentHeight, padding = 48, onBackgroundClick }: UseTreeCanvasViewportOptions
) => {
  const [viewport, setViewport] = useState<TreeCanvasViewport>({ x: padding, y: padding, zoom: 1 });
  const fitted = useRef(false);
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const zoomTo = useCallback(
    (zoom: number, origin?: { x: number; y: number }) =>
      setViewport(current => {
        const next = clamp(zoom, minZoom, maxZoom);
        const root = rootRef.current;
        const anchor = origin ?? { x: (root?.clientWidth ?? 0) / 2, y: (root?.clientHeight ?? 0) / 2 };
        const ratio = next / current.zoom;

        return {
          zoom: next,
          x: anchor.x - (anchor.x - current.x) * ratio,
          y: anchor.y - (anchor.y - current.y) * ratio
        };
      }),
    [maxZoom, minZoom, rootRef]
  );

  const zoomBy = useCallback(
    (factor: number, origin?: { x: number; y: number }) => zoomTo(viewportRef.current.zoom * factor, origin),
    [zoomTo]
  );

  const fit = useCallback(() => {
    const root = rootRef.current;
    const width = root?.clientWidth ?? 0;
    const height = root?.clientHeight ?? 0;
    if (!width || !height || !contentWidth || !contentHeight) {
      setViewport({ x: padding, y: padding, zoom: 1 });

      return;
    }

    const zoom = clamp(
      Math.min((width - padding * 2) / contentWidth, (height - padding * 2) / contentHeight, 1),
      minZoom,
      maxZoom
    );
    setViewport({
      zoom,
      x: (width - contentWidth * zoom) / 2,
      y: Math.max(padding, (height - contentHeight * zoom) / 2)
    });
  }, [contentHeight, contentWidth, maxZoom, minZoom, padding, rootRef]);

  // Fitted once, when there is first something to fit: after that the view is the author's to move.
  useLayoutEffect(() => {
    if (!fitted.current && contentWidth > 0) {
      fitted.current = true;
      fit();
    }
  }, [contentWidth, fit]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    // Not React's `onWheel`: it is passive, and the page behind would scroll along with the canvas.
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const rect = root.getBoundingClientRect();
        zoomTo(viewportRef.current.zoom * Math.exp(-e.deltaY * 0.01), {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });

        return;
      }

      setViewport(current => ({ ...current, x: current.x - e.deltaX, y: current.y - e.deltaY }));
    };

    root.addEventListener('wheel', handleWheel, { passive: false });

    return () => root.removeEventListener('wheel', handleWheel);
  }, [rootRef, zoomTo]);

  const handleBackgroundPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) {
        return;
      }

      const start = { x: e.clientX, y: e.clientY, viewportX: viewportRef.current.x, viewportY: viewportRef.current.y };
      let moved = false;
      const listening = new AbortController();

      const handleMove = (event: PointerEvent) => {
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        moved ||= Math.hypot(dx, dy) > CLICK_SLOP;
        if (moved) {
          setViewport(current => ({ ...current, x: start.viewportX + dx, y: start.viewportY + dy }));
        }
      };

      const handleUp = () => {
        listening.abort();
        if (!moved) {
          onBackgroundClick?.();
        }
      };

      window.addEventListener('pointermove', handleMove, { signal: listening.signal });
      window.addEventListener('pointerup', handleUp, { signal: listening.signal });
    },
    [onBackgroundClick]
  );

  /**
   * Brings a box of the canvas into view, centred — unless it is already all on screen, so following a selection with
   * the keyboard never moves the view under the author for nothing.
   */
  const reveal = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const root = rootRef.current;
      if (!root?.clientWidth || !root.clientHeight) {
        return;
      }

      const { x: viewX, y: viewY, zoom } = viewportRef.current;
      const left = viewX + x * zoom;
      const top = viewY + y * zoom;
      const margin = 24;
      const visible =
        left >= margin &&
        top >= margin &&
        left + width * zoom <= root.clientWidth - margin &&
        top + height * zoom <= root.clientHeight - margin;
      if (!visible) {
        setViewport(current => ({
          ...current,
          x: root.clientWidth / 2 - (x + width / 2) * current.zoom,
          y: root.clientHeight / 2 - (y + height / 2) * current.zoom
        }));
      }
    },
    [rootRef]
  );

  /** A point on the screen, in the canvas' own units — where the layout's positions live. */
  const toCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const rect = rootRef.current?.getBoundingClientRect();
      const { x, y, zoom } = viewportRef.current;

      return { x: (clientX - (rect?.left ?? 0) - x) / zoom, y: (clientY - (rect?.top ?? 0) - y) / zoom };
    },
    [rootRef]
  );

  return { viewport, zoomTo, zoomBy, fit, reveal, toCanvas, handleBackgroundPointerDown };
};

export default useTreeCanvasViewport;
