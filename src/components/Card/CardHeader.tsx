import { Children, cloneElement, isValidElement, useMemo } from 'react';

import Flex from '@components/Flex';
import Icon from '@components/Icon';
import useTheme from '@hooks/useTheme';

import type CardStyles from './Card.styles';
import type { variantKeys } from './Card.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { IconProps } from '@components/Icon';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode, RefObject } from 'react';

export type CardHeaderProps = {
  ref?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
  testId?: string;
  closeable?: boolean;
  onClose?: (e: MouseEvent) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'> &
  useThemeSharedProps<typeof CardStyles, typeof variantKeys & typeof variantKeysFlex>;

const CardHeader = ({
  ref,
  className,
  children,
  closeable,
  testId,
  intent,
  size,
  shadow,
  rounded,
  overflow,
  direction,
  wrap,
  items,
  justify = 'between',
  alignItems,
  gap = 2,
  onClose,
  ...props
}: CardHeaderProps) => {
  const classNameTheme = useTheme<typeof CardStyles, typeof variantKeys>('Card', {
    className,
    componentKey: ['header', 'headerCloseButton'],
    variants: { intent, size, shadow, rounded, overflow }
  });

  const { icon, content } = useMemo(() => {
    const components: { icon?: ReactNode; content: ReactNode[] } = {
      icon: undefined,
      content: []
    };
    Children.forEach(children, child => {
      if (typeof child === 'string') {
        components.content.push(child);

        return;
      }

      if (!isValidElement(child)) {
        return;
      }

      if (child.type === Icon) {
        const childProps = child.props as IconProps;
        components.icon = cloneElement<IconProps>(child as ReactElement<IconProps>, {
          testId: testId ? `${testId}-icon` : undefined,
          ...childProps,
          intent: childProps.intent ?? 'custom',
          size
        });
      } else if (child.type === 'i') {
        const childProps = child.props as IconProps;
        components.icon = cloneElement<IconProps & { 'data-testid'?: string }>(child as ReactElement<IconProps>, {
          'data-testid': testId ? `${testId}-icon` : undefined,
          ...childProps,
          intent: childProps.intent ?? 'custom',
          size
        });
      } else {
        components.content.push(child);
      }
    });

    return components;
  }, [children, testId, size]);

  return (
    <Flex
      {...props}
      ref={ref}
      testId={testId}
      className={classNameTheme.header}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      alignItems={alignItems}
    >
      {icon && (
        <Flex items="center" gap={2}>
          {icon}
          {content}
        </Flex>
      )}
      {!icon && content}
      {closeable && <Icon icon="fa-solid fa-xmark" className={classNameTheme.headerCloseButton} onClick={onClose} />}
    </Flex>
  );
};

export default CardHeader;
