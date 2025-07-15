import { createContext } from 'react';

import type { ModalProps } from './Modal';
import type { ReactNode } from 'react';

export type ProviderModalSlot<TValue = unknown> = ({
  onSubmit,
  onClose
}: {
  onSubmit: (value?: TValue) => void;
  onClose: () => void;
}) => ReactNode;

export type ProviderModalProps = Omit<ModalProps, 'children' | 'onClose' | 'isClosing' | 'open' | 'id'>;

export type ModalContextValue = {
  showModal: <TValue = unknown>(
    header: ReactNode | ProviderModalSlot<TValue>,
    body: ReactNode | ProviderModalSlot<TValue>,
    footer?: ReactNode | ProviderModalSlot<TValue>,
    settings?: ProviderModalProps
  ) => Promise<TValue | undefined>;
  showDialog: <TValue = unknown>(
    header: ReactNode | ProviderModalSlot<TValue>,
    body: ReactNode | ProviderModalSlot<TValue>,
    footer?: ReactNode | ProviderModalSlot<TValue>,
    settings?: ProviderModalProps
  ) => Promise<TValue | undefined>;
};

const modalContextDefaultValue = {
  showModal: () => {},
  showDialog: () => {}
} as unknown as ModalContextValue;

const ModalContext = createContext<ModalContextValue>(modalContextDefaultValue);

export default ModalContext;
