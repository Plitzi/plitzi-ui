import { useCallback, useEffect, useRef, useState } from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import type { Dispatch, RefObject, SetStateAction } from 'react';

export type UseFloatingProps = {
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  closeOnClick?: boolean;
  openOnClick?: boolean;
  onCloseValidate?: (e: Event) => boolean;
};

export type UseFloatingReturn = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  (e: React.MouseEvent) => void,
  RefObject<HTMLDivElement | null>
];

const useFloating = ({
  open: openProp,
  disabled = false,
  loading = false,
  closeOnClick = true,
  openOnClick = true,
  onCloseValidate
}: UseFloatingProps): UseFloatingReturn => {
  const [open, setOpen] = useState<boolean>(openProp ?? false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!open || !triggerRef.current || openProp !== undefined) {
        return;
      }

      if (
        (!(e.target as HTMLElement).closest('.container-floating') || closeOnClick) &&
        !triggerRef.current.contains(e.target as HTMLElement) &&
        (!onCloseValidate || onCloseValidate(e))
      ) {
        setOpen(false);
      }
    },
    [closeOnClick, onCloseValidate, open, openProp]
  );

  const handleClickTrigger = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || loading || !openOnClick) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      setOpen(state => !state);
    },
    [disabled, loading, openOnClick]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, open]);

  useDidUpdateEffect(() => {
    setOpen(openProp ?? false);
  }, [openProp]);

  return [open, setOpen, handleClickTrigger, triggerRef];
};

export default useFloating;
