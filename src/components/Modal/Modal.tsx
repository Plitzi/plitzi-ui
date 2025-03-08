import { useId } from 'react';
import { createPortal } from 'react-dom';

import Card from '@components/Card';
import useTheme from '@hooks/useTheme';

import type ModalStyles from './Modal.styles';
import type { variantKeys } from './Modal.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode, RefObject } from 'react';

export type ModalProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  id?: string;
  container?: Element | DocumentFragment;
  open?: boolean;
  // as?: 'dialog' | 'modal'; // @todo: support dialog behaviours
  onClose?: () => void;
} & useThemeSharedProps<typeof ModalStyles, typeof variantKeys>;

const Modal = ({ ref, className, children, id: idProp, container, open, onClose }: ModalProps) => {
  const classNameTheme = useTheme<typeof ModalStyles, typeof variantKeys, false>('Modal', {
    className,
    componentKey: ['root', 'background', 'card'],
    variant: {}
  });
  const id = useId();

  if (!open) {
    return undefined;
  }

  return createPortal(
    <div ref={ref} data-id={idProp ?? id} className={classNameTheme.root}>
      <div className={classNameTheme.background} onClick={onClose} />
      <Card className={classNameTheme.card} intent="modal">
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
