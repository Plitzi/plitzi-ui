import { useCallback, useEffect, useId, useState } from 'react';

export type UseDisclosureProps<TValue = unknown, TState = unknown> = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  delay?: number;
  onOpen?: (initialState?: TState) => void;
  onClose?:
    | ((value?: TValue, state?: TState) => boolean | Promise<boolean>)
    | ((value?: TValue, state?: TState) => void | Promise<void>);
};

export type UseDisclosureReturn<TValue = unknown, TState = unknown> = [
  id: string,
  open: boolean,
  onOpen: (initialState?: TState) => void,
  onClose: (value?: TValue) => Promise<void>,
  onToggle: () => void,
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
  delay = 0
}: UseDisclosureProps<TValue, TState> = {}): UseDisclosureReturn<TValue, TState> => {
  const [open, setOpen] = useState(openProp ?? defaultOpen ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosingValue, setIsClosingValue] = useState<TValue>();
  const [state, setState] = useState<TState>(undefined as TState);
  const uid = useId();
  const id = idProp ?? `disclosure-${uid}`;

  const onClose = useCallback(
    async (value?: TValue) => {
      if (delay && !isClosing) {
        setIsClosing(true);
        setIsClosingValue(value);

        return;
      }

      if (isClosing && !value && isClosingValue) {
        value = isClosingValue;
      }

      const response = await onCloseProp?.(value, state);
      if (response === false) {
        return;
      }

      setState(undefined as TState);
      if (openProp === undefined) {
        setOpen(false);
      }
    },
    [delay, isClosing, isClosingValue, onCloseProp, state, openProp]
  );

  const onOpen = useCallback(
    (initialState?: TState) => {
      if (openProp === undefined) {
        setOpen(true);
      }

      onOpenProp?.(initialState);
      setState(initialState as TState);
    },
    [openProp, onOpenProp]
  );

  const onToggle = useCallback(() => (open ? onClose() : onOpen()), [open, onOpen, onClose]);

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
