import omit from 'lodash/omit';
import { useCallback, useMemo, useState } from 'react';

import Modal from './Modal';
import ModalContext from './ModalContext';

import type { ModalProps } from './Modal';
import type { ModalContextValue } from './ModalContext';
import type { ReactNode } from 'react';

export type ModalProviderProps = {
  children?: ReactNode;
};

type ProviderModalProps = Parameters<ModalContextValue['showModal']>[3];

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [elements, setElements] = useState<Record<string, ModalProps>>({});

  const close = useCallback(
    <TValue = unknown,>(
      id: string,
      settings?: Pick<ModalProps, 'duration' | 'animation'>,
      resolve?: (value?: TValue) => void
    ) =>
      (value?: TValue) => {
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
      header?: ReactNode | (({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode),
      body?: ReactNode | (({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode),
      footer?: ReactNode | (({ onClose }: { onClose: (value?: TValue) => void }) => ReactNode),
      settings?: ProviderModalProps
    ) => {
      const key = new Date().getTime().toString();

      return new Promise<TValue | undefined>(resolve => {
        const onClose = close(key, settings, resolve);
        if (typeof header === 'function') {
          header = header({ onClose });
        }

        if (typeof body === 'function') {
          body = body({ onClose });
        }

        if (typeof footer === 'function') {
          footer = footer({ onClose });
        }

        setElements(state => ({
          ...state,
          [key]: {
            ...settings,
            id: key,
            children: [header, body, footer].filter(Boolean) as ReactNode[],
            onClose,
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
