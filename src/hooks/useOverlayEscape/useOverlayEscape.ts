import { useEffect, useId, useRef } from 'react';

import { isTopOverlay, pushOverlay, removeOverlay } from './overlayStack';

/**
 * Escape closes the overlay — the topmost one only — while it is open.
 *
 * Heard in the capture phase, before anything else on the page: the Escape that closes an overlay must not also reach
 * what is behind it (a canvas that deselects on Escape, a panel that clears its search). An open dropdown inside the
 * overlay (`aria-expanded="true"` around the focus) takes it first; the next Escape is the overlay's.
 */
const useOverlayEscape = (open: boolean, onClose: (() => void) | undefined): void => {
  const id = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      return;
    }

    pushOverlay(id);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !isTopOverlay(id) || !onCloseRef.current) {
        return;
      }

      if (e.target instanceof Element && e.target.closest('[aria-expanded="true"]')) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();
      onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      removeOverlay(id);
    };
  }, [id, open]);
};

export default useOverlayEscape;
