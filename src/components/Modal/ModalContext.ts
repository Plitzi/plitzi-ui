import { createContext } from 'react';

import type { ModalProps } from './Modal';
import type { ReactNode } from 'react';

export type ModalContextValue = {
  showModal: <TValue = unknown>(
    header?: ReactNode | (({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode),
    body?: ReactNode | (({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode),
    footer?: ReactNode | (({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode),
    settings?: Omit<ModalProps, 'children' | 'onClose' | 'isClosing' | 'open' | 'id'>
  ) => Promise<TValue | undefined>;
};

const modalContextDefaultValue = {
  showModal: () => {}
} as ModalContextValue;

const ModalContext = createContext<ModalContextValue>(modalContextDefaultValue);

export default ModalContext;
