import { Children, cloneElement, isValidElement, useMemo } from 'react';

import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

import type CardStyles from './Card.styles';
import type { variantKeys } from './Card.styles';
import type { CardBodyProps } from './CardBody';
import type { CardFooterProps } from './CardFooter';
import type { CardHeaderProps } from './CardHeader';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode, RefObject } from 'react';

export type CardProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  testId?: string;
  closeable?: boolean;
  onClose?: (e: MouseEvent) => void;
} & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof CardStyles, typeof variantKeys>;

const Card = ({
  ref,
  className,
  children,
  testId,
  closeable,
  onClose,
  intent,
  shadow,
  rounded,
  overflow,
  ...otherProps
}: CardProps) => {
  className = useTheme<typeof CardStyles, typeof variantKeys>('Card', {
    className,
    componentKey: 'root',
    variant: { intent, shadow, rounded, overflow }
  });

  const { header, body, footer } = useMemo(() => {
    const components: { header?: ReactNode; body?: ReactNode; footer?: ReactNode } = {
      header: undefined,
      body: undefined,
      footer: undefined
    };

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      if (child.type === CardHeader) {
        components.header = cloneElement<CardHeaderProps>(child as ReactElement<CardHeaderProps>, {
          testId: testId ? `${testId}-header` : undefined,
          intent,
          shadow,
          rounded,
          overflow,
          closeable,
          onClose,
          ...(child.props as CardHeaderProps)
        });
      } else if (child.type === CardBody) {
        components.body = cloneElement<CardBodyProps>(child as ReactElement<CardBodyProps>, {
          testId: testId ? `${testId}-body` : undefined,
          intent,
          shadow,
          rounded,
          overflow,
          ...(child.props as CardBodyProps)
        });
      } else if (child.type === CardFooter) {
        components.footer = cloneElement<CardFooterProps>(child as ReactElement<CardFooterProps>, {
          testId: testId ? `${testId}-footer` : undefined,
          intent,
          shadow,
          rounded,
          overflow,
          ...(child.props as CardFooterProps)
        });
      }
    });

    return components;
  }, [children, testId, intent, shadow, rounded, overflow, closeable, onClose]);

  return (
    <div ref={ref} {...otherProps} className={className}>
      {header}
      {body}
      {footer}
    </div>
  );
};

Card.Header = CardHeader;
Card.HeaderIcon = Icon;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
