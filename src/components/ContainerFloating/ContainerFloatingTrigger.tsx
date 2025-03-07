import useTheme from '@hooks/useTheme';

import type ContainerFloatingStyles from './ContainerFloating.styles';
import type { variantKeys } from './ContainerFloating.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode, RefObject } from 'react';

export type ContainerFloatingTriggerProps = {
  children?: ReactNode;
  ref?: RefObject<HTMLDivElement>;
  testId?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
} & useThemeSharedProps<typeof ContainerFloatingStyles, typeof variantKeys>;

const ContainerFloatingTrigger = ({ children, className, testId, ref, onClick }: ContainerFloatingTriggerProps) => {
  className = useTheme<typeof ContainerFloatingStyles, typeof variantKeys>('ContainerFloating', {
    className,
    componentKey: 'trigger',
    variant: {}
  });

  return (
    <div ref={ref} className={className} onClick={onClick} data-testid={testId}>
      {children}
    </div>
  );
};

export default ContainerFloatingTrigger;
