import useTheme from '@hooks/useTheme';

import type ContainerTabsStyles from './ContainerTabs.styles';
import type { variantKeys } from './ContainerTabs.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { ReactNode } from 'react';

export type TabContentProps = { children?: ReactNode } & useThemeSharedProps<
  typeof ContainerTabsStyles,
  typeof variantKeys
>;

const TabContent = ({ children, className }: TabContentProps) => {
  className = useTheme<typeof ContainerTabsStyles, typeof variantKeys>('ContainerTabs', {
    className,
    componentKey: 'content'
  });

  return <div className={className}>{children}</div>;
};

export default TabContent;
