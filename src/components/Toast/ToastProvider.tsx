import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import ToastContext from './ToastContext';
import { toastIdOf } from './utils';

import type { ToastSettings } from './ToastContext';
import type { ReactNode } from 'react';
import type { Id, Theme, ToastContent, ToastIcon, ToastOptions, ToastPosition, TypeOptions } from 'react-toastify';

export type { ToastPosition, ToastIcon, Theme as ToastTheme, TypeOptions as ToastTypeOptions };

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
    (content: ReactNode, settings: ToastSettings = {}) => {
      const {
        appeareance = 'default',
        placement = 'top-right',
        autoDismiss = true,
        autoDismissTimeout = 5000,
        theme = 'light',
        icon
      } = settings;
      const toastId = toastIdOf(content, appeareance, settings.id);
      if (toastId !== undefined && toast.isActive(toastId, id)) {
        return;
      }

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
        containerId: id,
        ...(toastId !== undefined ? { toastId } : {})
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
        className={clsx(classNameContainer, { 'toast-container--absolute': !isFixed })}
      />
      {children}
    </ToastContext>
  );
};

export default ToastProvider;
