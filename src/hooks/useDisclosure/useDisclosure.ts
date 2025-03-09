import { useCallback, useId, useState } from 'react';

export type UseDisclosureProps<T = unknown> = {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: (value?: T) => void;
  onSubmit?: () => void;
  onOpen?: () => void;
  id?: string;
};

export type UseDisclosureReturn<T = unknown> = [
  id: string,
  open: boolean,
  onOpen: () => void,
  onClose: (value?: T) => void,
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
    (value?: T) => {
      if (openProp === undefined) {
        setOpen(false);
      }

      onCloseProp?.(value);
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
