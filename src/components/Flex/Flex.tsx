import useTheme from '@hooks/useTheme';

import type FlexStyles from './Flex.styles';
import type { variantKeys } from './Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

export type FlexProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  testId?: string;
} & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof FlexStyles, typeof variantKeys>;

const Flex = ({
  ref,
  className,
  children,
  testId,
  direction,
  wrap,
  items,
  gap,
  justify,
  grow,
  basis,
  alignItems,
  shrink,
  ...props
}: FlexProps) => {
  className = useTheme<typeof FlexStyles, typeof variantKeys>('Flex', {
    className,
    componentKey: 'root',
    variants: { direction, wrap, items, gap, justify, grow, basis, shrink, alignItems }
  });

  return (
    <div {...props} data-testid={testId} className={className} ref={ref}>
      {children}
    </div>
  );
};

export default Flex;
