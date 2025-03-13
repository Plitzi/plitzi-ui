import { useCallback, useId, useState } from 'react';

export type UseDisclosureProps<TValue = unknown, TState = unknown> = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
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
  state: TState
];

const useDisclosure = <TValue = unknown, TState = unknown>({
  onClose: onCloseProp,
  onOpen: onOpenProp,
  open: openProp,
  defaultOpen,
  id: idProp
}: UseDisclosureProps<TValue, TState> = {}): UseDisclosureReturn<TValue, TState> => {
  const [open, setOpen] = useState(openProp ?? defaultOpen ?? false);
  const [state, setState] = useState<TState>(undefined as TState);
  const uid = useId();
  const id = idProp ?? `disclosure-${uid}`;

  const onClose = useCallback(
    async (value?: TValue) => {
      const response = await onCloseProp?.(value, state);
      if (response === false) {
        return;
      }

      setState(undefined as TState);
      if (openProp === undefined) {
        setOpen(false);
      }
    },
    [openProp, onCloseProp, state]
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

  return [id, open, onOpen, onClose, onToggle, state];
};

export default useDisclosure;
