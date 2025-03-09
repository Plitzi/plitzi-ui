import { useCallback, useId, useState } from 'react';

export type UseDisclosureProps<T = unknown> = {
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: ((value?: T) => boolean | Promise<boolean>) | ((value?: T) => void | Promise<void>);
};

export type UseDisclosureReturn<T = unknown> = [
  id: string,
  open: boolean,
  onOpen: () => void,
  onClose: (value?: T) => Promise<void>,
  onToggle: () => void
];

const useDisclosure = <T = unknown>({
  onClose: onCloseProp,
  onOpen: onOpenProp,
  open: openProp,
  defaultOpen,
  id: idProp
}: UseDisclosureProps<T> = {}): UseDisclosureReturn<T> => {
  const [open, setOpen] = useState(openProp ?? defaultOpen ?? false);
  const uid = useId();
  const id = idProp ?? `disclosure-${uid}`;

  const onClose = useCallback(
    async (value?: T) => {
      const response = await onCloseProp?.(value);
      if (response === false) {
        return;
      }

      if (openProp === undefined) {
        setOpen(false);
      }
    },
    [openProp, onCloseProp]
  );

  const onOpen = useCallback(() => {
    if (openProp === undefined) {
      setOpen(true);
    }

    onOpenProp?.();
  }, [openProp, onOpenProp]);

  const onToggle = useCallback(() => (open ? onClose() : onOpen()), [open, onOpen, onClose]);

  return [id, open, onOpen, onClose, onToggle];
};

export default useDisclosure;
