import { createContext } from 'react';

import type { ReactNode } from 'react';
import type { Theme, ToastIcon, ToastPosition, TypeOptions } from 'react-toastify';

export type ToastSettings = {
  appeareance?: TypeOptions;
  placement?: ToastPosition;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  theme?: Theme;
  icon?: ToastIcon;
  /**
   * What the toast is known by while it is on screen: a second one with the same id is not shown again. A text toast
   * is known by its text and its appearance without one; give one to a toast whose content is an element.
   */
  id?: string;
};

export type ToastContextValue = {
  addToast: (content: ReactNode, settings?: ToastSettings) => void;
};

const toastContextDefaultValue = { addToast: () => {} } as ToastContextValue;

const ToastContext = createContext<ToastContextValue>(toastContextDefaultValue);
ToastContext.displayName = 'ToastContext';

export default ToastContext;
