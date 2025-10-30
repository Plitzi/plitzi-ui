import { useCallback, useEffect, useId, useState } from 'react';

export type UseDisclosureProps<TValue = unknown, TState = unknown> = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  delay?: number;
  onOpen?: (e?: MouseEvent | React.MouseEvent, initialState?: TState) => void;
  onClose?:
    | ((e?: MouseEvent | React.MouseEvent, value?: TValue, state?: TState) => boolean | Promise<boolean>)
    | ((e?: MouseEvent | React.MouseEvent, value?: TValue, state?: TState) => void | Promise<void>);
  stopEventPropagation?: boolean;
};

export type UseDisclosureReturn<TValue = unknown, TState = unknown> = [
  id: string,
  open: boolean,
  onOpen: (e?: MouseEvent | React.MouseEvent, initialState?: TState) => void,
  onClose: (e?: MouseEvent | React.MouseEvent, value?: TValue) => Promise<void>,
  onToggle: (e?: MouseEvent | React.MouseEvent) => void,
  state: TState,
  delayState: {
    delay: number;
    isClosing: boolean;
  }
];

const useDisclosure = <TValue = unknown, TState = unknown>({
  onClose: onCloseProp,
  onOpen: onOpenProp,
  open: openProp,
  defaultOpen,
  id: idProp,
  delay = 0,
  stopEventPropagation = true
}: UseDisclosureProps<TValue, TState> = {}): UseDisclosureReturn<TValue, TState> => {
  const [open, setOpen] = useState(openProp ?? defaultOpen ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosingValue, setIsClosingValue] = useState<TValue>();
  const [state, setState] = useState<TState>(undefined as TState);
  const uid = useId();
  const id = idProp ?? `disclosure-${uid}`;

  const onClose = useCallback(
    async (e?: MouseEvent | React.MouseEvent, value?: TValue) => {
      if (stopEventPropagation) {
        e?.stopPropagation();
        e?.preventDefault();
      }

      if (delay && !isClosing) {
        setIsClosing(true);
        setIsClosingValue(value);

        return;
      }

      if (isClosing && !value && isClosingValue) {
        value = isClosingValue;
      }

      const response = await onCloseProp?.(e, value, state);
      if (response === false) {
        return;
      }

      setState(undefined as TState);
      if (openProp === undefined) {
        setOpen(false);
      }
    },
    [stopEventPropagation, delay, isClosing, isClosingValue, onCloseProp, state, openProp]
  );

  const onOpen = useCallback(
    (e?: MouseEvent | React.MouseEvent, initialState?: TState) => {
      if (stopEventPropagation) {
        e?.stopPropagation();
        e?.preventDefault();
      }

      if (openProp === undefined) {
        setOpen(true);
      }

      onOpenProp?.(e, initialState);
      setState(initialState as TState);
    },
    [stopEventPropagation, openProp, onOpenProp]
  );

  const onToggle = useCallback(
    (e?: MouseEvent | React.MouseEvent) => (open ? onClose(e) : onOpen(e)),
    [open, onOpen, onClose]
  );

  useEffect(() => {
    return () => {
      if (open) {
        setIsClosing(false);
      }
    };
  }, [open]);

  return [id, open, onOpen, onClose, onToggle, state, { delay, isClosing }];
};

export default useDisclosure;
