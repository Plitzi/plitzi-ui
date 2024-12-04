// Alias
import useTheme from '@hooks/useTheme';

// Types
import type FlexStyles from './Flex.styles';
import type { variantKeys } from './Flex.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

export type FlexProps = {
  ref?: Ref<HTMLDivElement>;
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
  ...props
}: FlexProps) => {
  className = useTheme<typeof FlexStyles, typeof variantKeys>('Flex', {
    className,
    componentKey: 'root',
    variant: { direction, wrap, items, gap, justify, grow }
  });

  return (
    <div {...props} data-testid={testId} className={className} ref={ref}>
      {children}
    </div>
  );
};

export default Flex;
