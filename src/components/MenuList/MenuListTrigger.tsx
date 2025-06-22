import useTheme from '@hooks/useTheme';

import type MenuListStyles from './MenuList.styles';
import type { variantKeys } from './MenuList.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, ReactNode, RefObject } from 'react';

export type MenuListTriggerProps = {
  children?: ReactNode;
  ref?: RefObject<HTMLDivElement>;
  testId?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
} & useThemeSharedProps<typeof MenuListStyles, typeof variantKeys>;

const MenuListTrigger = ({ children, className, testId, ref, onClick }: MenuListTriggerProps) => {
  className = useTheme<typeof MenuListStyles, typeof variantKeys>('MenuList', {
    className,
    componentKey: 'trigger'
  });

  return (
    <div ref={ref} className={className} onClick={onClick} data-testid={testId}>
      {children}
    </div>
  );
};

export default MenuListTrigger;
