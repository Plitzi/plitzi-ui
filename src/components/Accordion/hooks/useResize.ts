import { useCallback, useEffect, useRef, useState } from 'react';

import sortItemsByDOMOrder from '../helpers/sortItemsByDOMOrder';
import updateDOMStyles from '../helpers/updateDOMStyles';

import type { RefObject } from 'react';

type Panel = { id: string; el: HTMLElement; hasManualSize: boolean; frozen: boolean };

export type UseResizeOptions = { containerRef: RefObject<HTMLElement | null>; minSize?: number };

export default function useResize({ containerRef, minSize = 64 }: UseResizeOptions) {
  const panels = useRef<Panel[]>([]);
  const draggingData = useRef<{ startY: number; panelA: Panel; startA: number; panelB: Panel; startB: number } | null>(
    null
  );
  const [dragging, setDragging] = useState<boolean>(false);

  const resyncLayout = useCallback((ids?: string[]) => {
    const panelsAlive: Panel[] = [];
    panels.current.forEach(panel => {
      const found = ids?.includes(panel.id) ?? false;
      panel.frozen = !found;

      if (panel.hasManualSize && !found) {
        updateDOMStyles(panel.el, { flexGrow: '', flexBasis: '' });
        panel.hasManualSize = false;
      } else if (found) {
        panelsAlive.push(panel);
      }
    });

    if (panelsAlive.length > 0) {
      for (let i = panelsAlive.length - 1; i >= 0; i--) {
        const panel = panelsAlive[i];
        if (panel.hasManualSize) {
          updateDOMStyles(panel.el, { flexGrow: '', flexBasis: '' });
          panel.hasManualSize = false;

          break;
        }
      }
    }
  }, []);

  const registerPanel = useCallback((id: string, el: HTMLElement | null = null, frozen: boolean = false) => {
    if (!el || panels.current.find(p => p.id === id)) {
      return;
    }

    panels.current.push({ id, el, hasManualSize: false, frozen });
    panels.current = sortItemsByDOMOrder(panels.current);
  }, []);

  const unregisterPanel = useCallback((id: string) => {
    panels.current = panels.current.filter(p => p.id !== id);
  }, []);

  const onResizeStart = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      const index = panels.current.findIndex(p => p.id === id);
      if (
        index === -1 ||
        index === panels.current.length - 1 ||
        !containerRef.current ||
        panels.current.filter(p => !p.frozen).length <= 1
      ) {
        return;
      }

      const panelA = panels.current[index];
      let panelB = panels.current[index + 1] as Panel | undefined;
      if (panelB && panelB.frozen) {
        panelB = panels.current.find((p, i) => !p.frozen && p.id !== panelA.id && i > index);
      }

      if (!panelB) {
        return;
      }

      draggingData.current = {
        startY: e.clientY,
        panelA,
        startA: panelA.el.offsetHeight,
        panelB,
        startB: panelB.el.offsetHeight
      };
      updateDOMStyles(containerRef.current, { userSelect: 'none', cursor: 'row-resize' });
      updateDOMStyles(panelA.el, { flexBasis: `${panelA.el.offsetHeight}px`, flexGrow: '0' });
      updateDOMStyles(panelB.el, { flexBasis: `${panelB.el.offsetHeight}px`, flexGrow: '0' });
      setDragging(true);
      e.preventDefault();
    },
    [containerRef]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingData.current) {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      const { startY, panelA, startA, panelB, startB } = draggingData.current;
      const delta = e.clientY - startY;
      const newA = startA + delta;
      const newB = startB - delta;
      if (newA < minSize || newB < minSize) {
        return;
      }

      panelA.hasManualSize = true;
      updateDOMStyles(panelA.el, { flexBasis: `${newA}px` });

      panelB.hasManualSize = true;
      updateDOMStyles(panelB.el, { flexBasis: `${newB}px` });
    },
    [containerRef, minSize]
  );

  const onMouseUp = useCallback(() => {
    setDragging(false);
    updateDOMStyles(containerRef.current, { userSelect: '', cursor: '' });
    draggingData.current = null;
  }, [containerRef]);

  useEffect(() => {
    if (!dragging) {
      return;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  return {
    registerPanel,
    unregisterPanel,
    onResizeStart,
    resyncLayout
  };
}
