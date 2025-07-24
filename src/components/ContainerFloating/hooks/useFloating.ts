import { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';

import useDidUpdateEffect from '@hooks/useDidUpdateEffect';

import type { Dispatch, RefObject, SetStateAction } from 'react';

export type UseFloatingProps = {
  ref?: RefObject<HTMLDivElement | null>;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onCloseValidate?: (e: Event) => boolean;
};

export type UseFloatingReturn = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  (e: React.MouseEvent) => void,
  RefObject<HTMLDivElement | null>,
  DOMRect | undefined
];

const useFloating = ({
  ref,
  open: openProp,
  disabled = false,
  loading = false
}: UseFloatingProps): UseFloatingReturn => {
  const [open, setOpen] = useState<boolean>(openProp ?? false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => triggerRef.current!, []);

  const handleClickTrigger = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || loading || openProp !== undefined) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();
      setOpen(state => !state);
    },
    [disabled, loading, openProp]
  );

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
