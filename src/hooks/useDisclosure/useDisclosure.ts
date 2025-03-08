import { useCallback, useId, useState } from 'react';

export type UseDisclosureProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  id?: string;
};

export type UseDisclosureReturn = [
  id: string,
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
  onToggle: () => void
];

const useDisclosure = ({
  onClose: onCloseProp,
  onOpen: onOpenProp,
  open: openProp,
  defaultOpen,
  id: idProp
}: UseDisclosureProps = {}): UseDisclosureReturn => {
  const [open, setOpen] = useState(openProp ?? defaultOpen ?? false);
  const uid = useId();
  const id = idProp ?? `disclosure-${uid}`;

  const onClose = useCallback(() => {
    if (openProp === undefined) {
      setOpen(false);
    }

    onOpenProp?.();
  }, [openProp, onOpenProp]);

  const onOpen = useCallback(() => {
    if (openProp === undefined) {
      setOpen(true);
    }

    onCloseProp?.();
  }, [openProp, onCloseProp]);

  const onToggle = useCallback(() => (open ? onClose() : onOpen()), [open, onOpen, onClose]);

  return [id, open, onOpen, onClose, onToggle];
};

export default useDisclosure;
