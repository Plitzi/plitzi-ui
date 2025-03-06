import useTheme from '@hooks/useTheme';

import type ContainerFloatingStyles from './ContainerFloating.styles';
import type { variantKeys } from './ContainerFloating.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode, RefObject } from 'react';

export type ContainerFloatingContentProps = {
  ref?: RefObject<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
  testId?: string;
} & useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloatingContent = ({ ref, children, className, placement, testId }: ContainerFloatingContentProps) => {
  className = useTheme<typeof ContainerFloatingStyles, typeof variantKeys>('ContainerFloating', {
    className,
    componentKey: 'content',
    variant: { placement }
  });

  return (
    <div ref={ref} className={className} data-testid={testId ? `${testId}-content` : undefined}>
      {children}
    </div>
  );
};

export default ContainerFloatingContent;
