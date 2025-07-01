import { createContext } from 'react';

import type { ReactNode } from 'react';
import type { Theme, ToastIcon, ToastPosition, TypeOptions } from 'react-toastify';

export type ToastContextValue = {
  addToast: (
    content: ReactNode,
    settings?: {
      appeareance?: TypeOptions;
      placement?: ToastPosition;
      autoDismiss?: boolean;
      autoDismissTimeout?: number;
      theme?: Theme;
      icon?: ToastIcon;
    }
  ) => void;
};

const toastContextDefaultValue = { addToast: () => {} } as ToastContextValue;

const ToastContext = createContext<ToastContextValue>(toastContextDefaultValue);

export default ToastContext;
