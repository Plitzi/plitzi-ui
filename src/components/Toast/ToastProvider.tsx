import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import ToastContext from './ToastContext';

import type { ReactNode } from 'react';
import type { Id, Theme, ToastContent, ToastIcon, ToastOptions, ToastPosition, TypeOptions } from 'react-toastify';

export type ToastProviderProps = {
  children?: ReactNode;
  classNameToast?: string;
  classNameContainer?: string;
  isFixed?: boolean;
  containerId?: string;
};

const ToastProvider = ({
  children,
  classNameToast = '',
  classNameContainer = '',
  isFixed = true,
  containerId
}: ToastProviderProps) => {
  const id = useMemo(() => containerId ?? crypto.randomUUID(), [containerId]);

  const addToast = useCallback(
    async (
      content: ReactNode,
      settings: {
        appeareance?: TypeOptions;
        placement?: ToastPosition;
        autoDismiss?: boolean;
        autoDismissTimeout?: number;
        theme?: Theme;
        icon?: ToastIcon;
      } = {}
    ) => {
      const {
        appeareance = 'default',
        placement = 'top-right',
        autoDismiss = true,
        autoDismissTimeout = 5000,
        theme = 'light',
        icon
      } = settings;
      let toastFinal: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id = toast;
      if (
        (appeareance as TypeOptions | undefined) &&
        appeareance !== 'default' &&
        (toast[appeareance] as typeof toast | undefined)
      ) {
        toastFinal = toast[appeareance];
      }

      toastFinal(content, {
        className: classNameToast,
        position: placement,
        autoClose: autoDismiss ? autoDismissTimeout : false,
        hideProgressBar: !autoDismiss,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme,
        icon,
        containerId: id
      });
    },
    [classNameToast, id]
  );

  const toastContextValue = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext value={toastContextValue}>
      <ToastContainer
        containerId={id}
        pauseOnFocusLoss={false}
        className={classNames(classNameContainer, { 'toast-container--absolute': !isFixed })}
      />
      {children}
    </ToastContext>
  );
};

export default ToastProvider;
