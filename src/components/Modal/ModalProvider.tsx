import omit from 'lodash/omit';
import { useCallback, useMemo, useState } from 'react';

import Modal from './Modal';
import ModalContext from './ModalContext';

import type { ModalProps } from './Modal';
import type { ModalContextValue, ProviderModalSlot } from './ModalContext';
import type { ReactNode } from 'react';

export type ModalProviderProps = {
  children?: ReactNode;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [elements, setElements] = useState<Record<string, ModalProps>>({});

  const close = useCallback(
    <TValue = unknown,>(
      id: string,
      settings?: Pick<ModalProps, 'duration' | 'animation'>,
      resolve?: (value?: TValue) => void,
      mode: 'cancel' | 'submit' = 'cancel'
    ) =>
      (value?: TValue) => {
        if (mode === 'cancel') {
          value = undefined;
        }

        if (settings && settings.animation && settings.duration) {
          setElements(state => ({ ...state, [id]: { ...state[id], isClosing: true } }));
          setTimeout(() => {
            setElements(state => omit(state, [id]));
            resolve?.(value);
          }, settings.duration);
        } else {
          setElements(state => omit(state, [id]));
          resolve?.(value);
        }
      },
    []
  );

  const showModal = useCallback(
    <TValue = unknown,>(
      header: ReactNode | ProviderModalSlot<TValue>,
      body: ReactNode | ProviderModalSlot<TValue>,
      footer?: ReactNode | ProviderModalSlot<TValue>,
      settings?: Parameters<ModalContextValue['showModal']>[3]
    ) => {
      const key = new Date().getTime().toString();

      return new Promise<TValue | undefined>(resolve => {
        const onClose = close(key, settings, resolve, 'cancel');
        const onSubmit = close(key, settings, resolve, 'submit');
        if (typeof header === 'function') {
          header = header({ onSubmit, onClose });
        }

        if (typeof body === 'function') {
          body = body({ onSubmit, onClose });
        }

        if (typeof footer === 'function') {
          footer = footer({ onSubmit, onClose });
        }

        setElements(state => ({
          ...state,
          [key]: {
            ...settings,
            id: key,
            children: [header, body, footer].filter(Boolean) as ReactNode[],
            onClose: onSubmit,
            open: true,
            isClosing: false
          }
        }));
      });
    },
    [close]
  );

  const modalMemo = useMemo(() => ({ showModal }), [showModal]);

  return (
    <ModalContext value={modalMemo}>
      {children}
      {Object.values(elements).map(settings => (
        <Modal key={settings.id} {...settings} />
      ))}
    </ModalContext>
  );
};

export default ModalProvider;
