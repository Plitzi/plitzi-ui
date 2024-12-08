// Packages
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export type UseResizeProps = {
  panels: { size: number; minSize: number }[];
  containerRef: RefObject<HTMLDivElement | null>;
  updatePanelStyles?: (containerRef: RefObject<HTMLDivElement | null>, sizes: number[]) => void;
};

export type UseResizeResponse = [RefObject<number[]>, () => void, boolean];

const updatePanelStylesDefault = (containerRef: RefObject<HTMLDivElement | null>, sizes: number[]) => {
  const panelElements = Array.from(containerRef.current?.children ?? []) as HTMLElement[];
  panelElements.forEach((panel, index) => {
    panel.style.flexBasis = `${sizes[index]}px`;
  });
};

const useResize = ({
  panels,
  containerRef,
  updatePanelStyles = updatePanelStylesDefault
}: UseResizeProps): UseResizeResponse => {
  const [resizing, setResizing] = useState(false);
  const sizes = useRef<number[]>(panels.map(panel => panel.size));
  const startY = useRef<number>(0);
  const currentIndex = useRef<number>(0);

  const handleResize = useCallback(
    (index: number, delta: number) => {
      const minSizes = panels.map(panel => panel.minSize);
      const currentSize = sizes.current[index] + delta;
      const nextSize = sizes.current[index + 1] - delta;
      if (currentSize >= minSizes[index] && nextSize >= minSizes[index + 1]) {
        sizes.current[index] = currentSize;
        sizes.current[index + 1] = nextSize;
        updatePanelStyles(containerRef, sizes.current);
      }
    },
    [containerRef, panels, updatePanelStyles]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const delta = e.clientY - startY.current;
      handleResize(currentIndex.current, delta);
      startY.current = e.clientY;
      setResizing(true);
    },
    [handleResize]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setResizing(false);
    },
    [handleMouseMove]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      startY.current = e.clientY;
      currentIndex.current = index;
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    const panelElements = Array.from(containerRef.current?.children ?? []) as HTMLElement[];
    startY.current = 0;
    currentIndex.current = 0;

    panelElements.forEach((panel, index) => {
      sizes.current[index] = panel.offsetHeight;
      if (index < panels.length - 1) {
        const divider = panel.querySelector('.divider');
        divider?.addEventListener('mousedown', e => handleMouseDown(e as MouseEvent, index));
      }
    });

    return () => {
      panelElements.forEach(panel => {
        const divider = panel.querySelector('.divider');
        divider?.removeEventListener('mousedown', handleMouseDown as EventListener);
      });
    };
  }, [containerRef, panels, handleResize, handleMouseDown]);

  const updatePanels = useCallback(
    () => updatePanelStyles(containerRef, sizes.current),
    [containerRef, updatePanelStyles]
  );

  return [sizes, updatePanels, resizing];
};

export default useResize;
