import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import type CardStyles from './Card.styles';
import type { variantKeys } from './Card.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

export type CardBodyProps = {
  ref?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
  testId?: string;
} & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof CardStyles, typeof variantKeys & typeof variantKeysFlex>;

const CardBody = ({
  ref,
  className,
  children,
  testId,
  intent,
  shadow,
  rounded,
  overflow,
  direction = 'column',
  wrap,
  items,
  justify,
  alignItems,
  gap,
  ...props
}: CardBodyProps) => {
  className = useTheme<typeof CardStyles, typeof variantKeys>('Card', {
    className,
    componentKey: 'body',
    variants: { intent, shadow, rounded, overflow }
  });

  return (
    <Flex
      {...props}
      ref={ref}
      testId={testId}
      className={className}
      direction={direction}
      wrap={wrap}
      items={items}
      justify={justify}
      gap={gap}
      alignItems={alignItems}
    >
      {children}
    </Flex>
  );
};

export default CardBody;
