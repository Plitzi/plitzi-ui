// Packages
import { use } from 'react';

// Relatives
import ModalContext from './ModalContext';

const useModal = () => {
  const context = use(ModalContext);
  if (context === undefined) {
    throw new Error('ModalContext value is undefined. Make sure you use the ModalProvider before using the hook.');
  }

  return context;
};

export default useModal;
