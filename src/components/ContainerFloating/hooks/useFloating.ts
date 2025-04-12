import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import type { Dispatch, RefObject, SetStateAction } from 'react';

export type UseFloatingProps = {
  ref?: RefObject<HTMLDivElement | null>;
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
  RefObject<HTMLDivElement | null>,
  DOMRect | undefined
];

type Handler = (e: MouseEvent) => void;
let handlers: Handler[] = [];
const registerClickOutsideHandler = (callback: Handler) => {
  handlers.push(callback);

  return () => {
    handlers = handlers.filter(handler => handler !== callback);
  };
};

if (typeof window !== 'undefined') {
  document.addEventListener('click', (e: MouseEvent) => handlers[handlers.length - 1]?.(e), true);
}

const useFloating = ({
  ref,
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
        (!ref?.current?.contains(e.target as HTMLElement) || closeOnClick) &&
        !triggerRef.current.contains(e.target as HTMLElement) &&
        (!onCloseValidate || onCloseValidate(e))
      ) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        setOpen(false);
      }
    },
    [closeOnClick, onCloseValidate, open, openProp, ref]
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

    const unregister = registerClickOutsideHandler(handleClickOutside);

    return () => {
      unregister();
    };
  }, [handleClickOutside, open]);

  useDidUpdateEffect(() => {
    setOpen(openProp ?? false);
  }, [openProp]);

  const triggerRect = useMemo<DOMRect | undefined>(
    () => triggerRef.current?.getBoundingClientRect(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerRef.current, open]
  );

  return [open, setOpen, handleClickTrigger, triggerRef, triggerRect];
};

export default useFloating;
