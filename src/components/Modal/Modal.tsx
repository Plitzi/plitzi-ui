import clsx from 'clsx';
import { useCallback, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

import Card from '@components/Card';
import useOverlayEscape from '@hooks/useOverlayEscape';
import useTheme from '@hooks/useTheme';

import type ModalStyles from './Modal.styles';
import type { variantKeys } from './Modal.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode, RefObject } from 'react';

export type ModalProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  id?: string;
  style?: CSSProperties;
  container?: Element | DocumentFragment;
  open?: boolean;
  animation?: 'zoom' | 'fade' | 'flip' | 'door' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  duration?: number;
  isClosing?: boolean;
  onClose?: (e?: MouseEvent) => void | Promise<void>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'> &
  useThemeSharedProps<typeof ModalStyles, typeof variantKeys>;

const Modal = ({
  ref,
  className,
  children,
  style,
  animation,
  duration = 300,
  id: idProp,
  container,
  open,
  isClosing = false,
  size,
  onClose,
  ...otherProps
}: ModalProps) => {
  const classNameTheme = useTheme<typeof ModalStyles, typeof variantKeys>('Modal', {
    className,
    componentKey: ['root', 'background', 'card']
  });
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => rootRef.current, []);

  const handleClose = useCallback((e: MouseEvent) => void onClose?.(e), [onClose]);

  const handleEscape = useCallback(() => void onClose?.(), [onClose]);

  const handleAnimationEnd = useCallback(
    () => animation && isClosing && void onClose?.(),
    [animation, isClosing, onClose]
  );

  useOverlayEscape(!!open, onClose ? handleEscape : undefined);

  // Focus moves into an opened modal — unless something in it already took it — so the keys pressed next are its own,
  // even when it was opened from inside an iframe that would otherwise keep them.
  useEffect(() => {
    const root = rootRef.current;
    if (open && root && !root.contains(document.activeElement)) {
      root.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
    }

    return () => {
      if (open) {
        document.body.classList.remove('modal-open');
      }
    };
  }, [open]);

  if (!open) {
    return undefined;
  }

  return createPortal(
    <div
      ref={rootRef}
      data-id={idProp ?? id}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className={clsx(classNameTheme.root, 'outline-none')}
      {...otherProps}
    >
      <div className={classNameTheme.background} onClick={handleClose} />
      <Card
        className={clsx(classNameTheme.card, {
          [`modal--${animation}-${isClosing ? 'leave' : 'enter'}`]: animation
        })}
        intent="modal"
        size={size}
        closeable
        onClose={handleClose}
        onAnimationEnd={handleAnimationEnd}
        style={{ ...style, animationDuration: `${duration}ms` }}
      >
        {children}
      </Card>
    </div>,
    container ?? document.body
  );
};

Modal.Header = Card.Header;
Modal.HeaderIcon = Card.HeaderIcon;
Modal.Body = Card.Body;
Modal.Footer = Card.Footer;

export default Modal;
