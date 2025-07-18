import Flex from '@components/Flex';
import useTheme from '@hooks/useTheme';

import type CardStyles from './Card.styles';
import type { variantKeys } from './Card.styles';
import type { variantKeys as variantKeysFlex } from '@components/Flex/Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

export type CardFooterProps = {
  ref?: RefObject<HTMLDivElement | null>;
  hildren?: ReactNode;
  testId?: string;
} & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof CardStyles, typeof variantKeys & typeof variantKeysFlex>;

const CardFooter = ({
  ref,
  className,
  children,
  testId,
  intent,
  shadow,
  rounded,
  overflow,
  direction,
  wrap,
  items,
  justify,
  alignItems,
  gap = 2,
  ...props
}: CardFooterProps) => {
  className = useTheme<typeof CardStyles, typeof variantKeys>('Card', {
    className,
    componentKey: 'footer',
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

export default CardFooter;
