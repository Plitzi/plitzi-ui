import { use } from 'react';

import ModalContext from './ModalContext';

import type { ModalContextValue } from './ModalContext';

const useModal = () => {
  const context = use(ModalContext);
  if (!(context as ModalContextValue | undefined)) {
    throw new Error('ModalContext value is undefined. Make sure you use the ModalProvider before using the hook.');
  }

  return context;
};

export default useModal;
