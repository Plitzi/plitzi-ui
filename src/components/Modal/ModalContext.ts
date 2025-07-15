import { createContext } from 'react';

import type { ModalProps } from './Modal';
import type { ReactNode } from 'react';

export type ProviderModalSlot<TValue = unknown> = ({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode;

export type ModalContextValue = {
  showModal: <TValue = unknown>(
    header: ReactNode | ProviderModalSlot<TValue>,
    body: ReactNode | ProviderModalSlot<TValue>,
    footer?: ReactNode | ProviderModalSlot<TValue>,
    settings?: Omit<ModalProps, 'children' | 'onClose' | 'isClosing' | 'open' | 'id'>
  ) => Promise<TValue | undefined>;
};

const modalContextDefaultValue = {
  showModal: () => {}
} as unknown as ModalContextValue;

const ModalContext = createContext<ModalContextValue>(modalContextDefaultValue);

export default ModalContext;
