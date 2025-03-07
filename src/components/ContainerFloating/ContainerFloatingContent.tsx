import useTheme from '@hooks/useTheme';

import type ContainerFloatingStyles from './ContainerFloating.styles';
import type { variantKeys } from './ContainerFloating.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

export type ContainerFloatingContentProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
  testId?: string;
} & HTMLAttributes<HTMLDivElement> &
  useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloatingContent = ({
  ref,
  children,
  className,
  placement,
  testId,
  ...props
}: ContainerFloatingContentProps) => {
  className = useTheme<typeof ContainerFloatingStyles, typeof variantKeys>('ContainerFloating', {
    className,
    componentKey: 'content',
    variant: { placement }
  });

  return (
    <div {...props} ref={ref} className={className} data-testid={testId}>
      {children}
    </div>
  );
};

export default ContainerFloatingContent;
