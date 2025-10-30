import omit from 'lodash/omit.js';
import { useCallback, useMemo, useState } from 'react';

import Button from '@components/Button';

import Modal from './Modal';
import ModalContext from './ModalContext';

import type { ModalProps } from './Modal';
import type { ProviderModalProps, ProviderModalSlot } from './ModalContext';
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
      mode: 'cancel' | 'submit' = 'cancel',
      stopPropagation?: boolean
    ) =>
      (e?: MouseEvent | React.MouseEvent, value?: TValue) => {
        if (e && stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }

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
      settings?: ProviderModalProps,
      stopPropagation: boolean = true
    ) => {
      const key = new Date().getTime().toString();

      return new Promise<TValue | undefined>(resolve => {
        const onClose = close(key, settings, resolve, 'cancel', stopPropagation);
        const onSubmit = close(key, settings, resolve, 'submit', stopPropagation);
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

  const showDialog = useCallback(
    <TValue = boolean,>(
      header: ReactNode | ProviderModalSlot<TValue>,
      body: ReactNode | ProviderModalSlot<TValue>,
      footer?: ReactNode | ProviderModalSlot<TValue>,
      settings?: ProviderModalProps,
      successValue = true as TValue
    ) => {
      if (!footer) {
        footer = ({ onSubmit, onClose }) => (
          <Modal.Footer gap={3} justify="end">
            <Button onClick={(e: React.MouseEvent) => onSubmit(e, successValue)} size={settings?.size}>
              Accept
            </Button>
            <Button onClick={onClose} size={settings?.size}>
              Cancel
            </Button>
          </Modal.Footer>
        );
      }

      return showModal(header, body, footer, settings);
    },
    [showModal]
  );

  const modalMemo = useMemo(() => ({ showModal, showDialog }), [showModal, showDialog]);

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
