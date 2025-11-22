import clsx from 'clsx';
import { useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

import Card from '@components/Card';
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

  const handleClose = useCallback((e: MouseEvent) => void onClose?.(e), [onClose]);

  const handleAnimationEnd = useCallback(
    () => animation && isClosing && void onClose?.(),
    [animation, isClosing, onClose]
  );

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
    <div ref={ref} data-id={idProp ?? id} className={classNameTheme.root} {...otherProps}>
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
