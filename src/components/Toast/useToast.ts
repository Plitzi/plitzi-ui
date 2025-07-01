import { use } from 'react';

import ToastContext from './ToastContext';

import type { ToastContextValue } from './ToastContext';

const useToast = () => {
  const context = use(ToastContext);
  if ((context as ToastContextValue | undefined) === undefined) {
    throw new Error('ToastContext value is undefined. Make sure you use the ToastProvider before using the hook.');
  }

  return context;
};

export default useToast;
